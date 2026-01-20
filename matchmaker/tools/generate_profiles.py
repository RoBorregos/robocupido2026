"""Generate synthetic profile CSVs for testing the matchmaker.

Usage:
    python tools/generate_profiles.py --count 150 --out ../data/sample_profiles_150.csv

"""
import csv
import random
import argparse
from pathlib import Path

FIRST_NAMES = [
    'Ana','Carlos','Lucia','Diego','Mariana','Luis','Sofia','Javier','Elena','Miguel',
    'Laura','Pablo','Clara','Alberto','Isabel','Fernando','Carmen','Raul','Marta','Sergio',
    'Andrea','Ramon','Silvia','Diego','Rocio','Victor','Nuria','Alvaro','Teresa','Iván'
]

LOCATIONS = ['Madrid','Barcelona','Valencia','Seville','Bilbao','Malaga']

INTERESTS = [
    'cinema','music','cooking','travel','football','yoga','art','tech','gaming','hiking',
    'reading','dancing','photography','gardening','coding'
]

GENDERS = ['male', 'female']

TRAIT_KEYS = ['trait_extraversion','trait_agreeableness','trait_conscientiousness','trait_neuroticism','trait_openness']


def random_traits():
    # produce five floats between 0.2 and 0.9
    return [round(random.uniform(0.2, 0.9), 3) for _ in range(5)]


def make_profile(i: int):
    name = random.choice(FIRST_NAMES)
    gender = random.choice(GENDERS)
    age = random.randint(22, 45)
    location = random.choice(LOCATIONS)
    interests = '|'.join(random.sample(INTERESTS, k=3))
    # most users look for opposite gender, some look for any
    if random.random() < 0.15:
        looking_for = 'any'
    else:
        looking_for = 'female' if gender == 'male' else 'male'
    min_age = max(18, age - random.randint(2, 6))
    max_age = age + random.randint(2, 8)
    traits = random_traits()
    row = {
        'id': str(i),
        'name': f"{name}{i}",
        'age': str(age),
        'gender': gender,
        'location': location,
        'interests': interests,
        'looking_for_gender': looking_for,
        'min_age': str(min_age),
        'max_age': str(max_age),
    }
    for key, val in zip(TRAIT_KEYS, traits):
        row[key] = f"{val}"
    return row


def generate(count: int, out_path: Path):
    random.seed(42)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    header = ['id','name','age','gender','location','interests','looking_for_gender','min_age','max_age'] + TRAIT_KEYS
    with out_path.open('w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        for i in range(1, count + 1):
            writer.writerow(make_profile(i))
    print(f'Wrote {count} profiles to {out_path}')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--count', type=int, default=150)
    parser.add_argument('--out', default='../data/sample_profiles_150.csv')
    args = parser.parse_args()
    out = Path(__file__).parent.joinpath(args.out).resolve()
    generate(args.count, out)


if __name__ == '__main__':
    main()
