import csv
import math
import re
from typing import List, Dict, Any, Set, Tuple

# Canonical trait names and column prefix used when CSV provides named traits
TRAIT_KEYS = ['extraversion', 'agreeableness', 'conscientiousness', 'neuroticism', 'openness']


def normalize_vector(vec: List[float]) -> List[float]:
    if not vec:
        return []
    # If values are already in 0..1, keep them. If max>1, scale down to 0..1
    maxv = max(vec)
    if maxv > 1:
        return [v / maxv for v in vec]
    return vec


def load_profiles_from_csv(path: str) -> List[Dict[str, Any]]:
    profiles = []
    with open(path, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            profile = {
                'id': r['id'],
                'name': r.get('name', ''),
                'age': int(r.get('age') or 0),
                'gender': r.get('gender', '').lower(),
                'location': r.get('location', ''),
                'interests': set([s.strip().lower() for s in re.split(r'[,|]', (r.get('interests') or '')) if s.strip()]),
                'looking_for_gender': r.get('looking_for_gender', '').lower(),
                'min_age': int(r.get('min_age') or 0),
                'max_age': int(r.get('max_age') or 0),
            }
            # Parse traits: prefer named trait columns (trait_<name>), else fallback to legacy pipe-separated 'traits'
            named_values = []
            for key in TRAIT_KEYS:
                col = f'trait_{key}'
                val = r.get(col)
                if val is None or val == '':
                    named_values = []
                    break
                try:
                    named_values.append(float(val))
                except ValueError:
                    named_values = []
                    break

            if named_values:
                traits = normalize_vector(named_values)
            else:
                traits = [float(x) for x in (r.get('traits') or '').split('|') if x.strip()]
                traits = normalize_vector(traits)

            profile['traits'] = traits
            profile['trait_names'] = TRAIT_KEYS if len(traits) == len(TRAIT_KEYS) else None
            profiles.append(profile)
    return profiles


def jaccard(a: Set[str], b: Set[str]) -> float:
    if not a and not b:
        return 1.0
    inter = len(a & b)
    uni = len(a | b)
    return inter / uni if uni else 0.0


def cosine(u: List[float], v: List[float]) -> float:
    if not u or not v:
        return 0.0
    dot = sum(x * y for x, y in zip(u, v))
    nu = math.sqrt(sum(x * x for x in u))
    nv = math.sqrt(sum(y * y for y in v))
    if nu == 0 or nv == 0:
        return 0.0
    return dot / (nu * nv)


def age_and_gender_compatible(a: Dict[str, Any], b: Dict[str, Any]) -> bool:
    # check that each person falls into the other's desired age/gender range
    if a['looking_for_gender'] and b['gender'] and a['looking_for_gender'] != 'any' and a['looking_for_gender'] != b['gender']:
        return False
    if b['looking_for_gender'] and a['gender'] and b['looking_for_gender'] != 'any' and b['looking_for_gender'] != a['gender']:
        return False
    if not (b['min_age'] <= a['age'] <= b['max_age']):
        return False
    if not (a['min_age'] <= b['age'] <= a['max_age']):
        return False
    return True


def compatibility_score(a: Dict[str, Any], b: Dict[str, Any], weights: Dict[str, float] = None) -> float:
    if weights is None:
        weights = {'interests': 0.55, 'traits': 0.35, 'location': 0.10}

    if not age_and_gender_compatible(a, b):
        return 0.0

    interests_sim = jaccard(a['interests'], b['interests'])
    traits_sim = cosine(a.get('traits', []), b.get('traits', []))
    location_sim = 1.0 if a.get('location') and a['location'].lower() == b.get('location', '').lower() else 0.0

    score = (
        weights['interests'] * interests_sim +
        weights['traits'] * traits_sim +
        weights['location'] * location_sim
    )
    return score


def find_matches_for_user(user_id: str, profiles: List[Dict[str, Any]], top_k: int = 5) -> List[Tuple[Dict[str, Any], float]]:
    user = next((p for p in profiles if p['id'] == user_id), None)
    if not user:
        raise ValueError('user_id not found')
    scores = []
    for p in profiles:
        if p['id'] == user_id:
            continue
        s = compatibility_score(user, p)
        if s > 0:
            scores.append((p, s))
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:top_k]


def build_global_matches(profiles: List[Dict[str, Any]], min_score: float = 0.0) -> Tuple[List[Tuple[Dict[str, Any], Dict[str, Any], float]], List[Dict[str, Any]]]:
    """Compute symmetric pair scores and produce a greedy one-to-one matching.

    Returns (pairs, singles). Each pair is (p1, p2, score). Singles are profiles with no partner.
    """
    pairs_scores = []
    n = len(profiles)
    for i in range(n):
        for j in range(i + 1, n):
            a = profiles[i]
            b = profiles[j]
            s1 = compatibility_score(a, b)
            s2 = compatibility_score(b, a)
            sym = (s1 + s2) / 2.0
            if sym > 0:
                pairs_scores.append((a, b, sym))

    pairs_scores.sort(key=lambda x: x[2], reverse=True)
    matched: Set[str] = set()
    matches: List[Tuple[Dict[str, Any], Dict[str, Any], float]] = []

    for a, b, s in pairs_scores:
        if s < min_score:
            continue
        if a['id'] in matched or b['id'] in matched:
            continue
        matches.append((a, b, s))
        matched.add(a['id'])
        matched.add(b['id'])

    singles = [p for p in profiles if p['id'] not in matched]
    return matches, singles


def export_matches_csv(path: str, matches: List[Tuple[Dict[str, Any], Dict[str, Any], float]], singles: List[Dict[str, Any]]):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['id1', 'name1', 'id2', 'name2', 'score'])
        for a, b, s in matches:
            writer.writerow([a['id'], a.get('name', ''), b['id'], b.get('name', ''), f"{s:.6f}"])
        for p in singles:
            writer.writerow([p['id'], p.get('name', ''), '', '', ''])


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Simple matchmaker demo')
    parser.add_argument('csv', help='profiles CSV')
    parser.add_argument('user_id', nargs='?', help='user id to find matches for')
    parser.add_argument('--k', type=int, default=5, help='top k matches')
    parser.add_argument('--export', help='export global matches CSV to this path')
    parser.add_argument('--min-score', type=float, default=0.0, help='minimum symmetric score for a pair to be matched')
    args = parser.parse_args()
    profiles = load_profiles_from_csv(args.csv)
    if args.export:
        matches, singles = build_global_matches(profiles, min_score=args.min_score)
        export_matches_csv(args.export, matches, singles)
        print(f'Exported {len(matches)} pairs and {len(singles)} singles to {args.export}')
    else:
        if not args.user_id:
            parser.error('user_id is required when not using --export')
        matches = find_matches_for_user(args.user_id, profiles, top_k=args.k)
        for p, score in matches:
            print(f"{p['id']} - {p['name']} (score={score:.3f})")
