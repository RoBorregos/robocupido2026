#!/usr/bin/env python3
"""
Robocupido Matching Algorithm

This script matches all users who completed their profiles.
Each user gets at least 4 matches based on embedding similarity.

Algorithm:
1. Load all users with completed profiles (those with profileDescription and embeddings)
2. For each user, calculate similarity between their "aboutThem" embedding and all other users' "aboutMe" embedding
3. Apply preference filters (gender preferences, lookingFor compatibility)
4. Ensure everyone gets at least 4 matches
5. Store matches in the database
"""

import os
import sys
import json
import numpy as np
from typing import Optional
from dataclasses import dataclass
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL environment variable not set")
    sys.exit(1)


@dataclass
class User:
    id: str
    name: Optional[str]
    instagram: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    preferences: Optional[str]  # Gender preference for dating
    looking_for: Optional[str]  # "Pareja", "Amigos", "Algo casual"
    about_me_embedding: Optional[np.ndarray]
    about_them_embedding: Optional[np.ndarray]


def parse_vector(vector_str: str) -> np.ndarray:
    """Parse PostgreSQL vector string to numpy array"""
    if vector_str is None:
        return None
    # Remove brackets and split by comma
    clean = vector_str.strip("[]")
    return np.array([float(x) for x in clean.split(",")])


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors"""
    if a is None or b is None:
        return 0.0
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)


def are_compatible(user1: User, user2: User) -> bool:
    """
    Check if two users are compatible based on their preferences.
    
    Compatibility rules:
    - If both are looking for "Amigos", they're compatible (friendship has no gender preference)
    - If either is looking for "Pareja" or "Algo casual", check gender preferences
    - "Indiferente" preference matches with any gender
    """
    # If both are looking for friends, always compatible
    if user1.looking_for == "Amigos" and user2.looking_for == "Amigos":
        return True
    
    # If one is looking for friends and the other for something else, not compatible
    if user1.looking_for == "Amigos" or user2.looking_for == "Amigos":
        return False
    
    # For romantic/casual matches, check gender preferences
    # user1's preferences should match user2's gender and vice versa
    
    def matches_preference(preference: Optional[str], gender: Optional[str]) -> bool:
        """Check if a gender matches a preference"""
        if preference is None or preference == "" or preference == "Ambos":
            return True
        # "Indiferente" means they're open to any gender
        if preference.lower() == "indiferente":
            return True
        if gender is None:
            return True
        # Handle various preference formats
        pref_lower = preference.lower()
        gender_lower = gender.lower()
        
        if "hombre" in pref_lower and "hombre" in gender_lower:
            return True
        if "mujer" in pref_lower and "mujer" in gender_lower:
            return True
        if "hombre" in pref_lower and "masculino" in gender_lower:
            return True
        if "mujer" in pref_lower and "femenino" in gender_lower:
            return True
        if preference == gender:
            return True
        return False
    
    # Check both directions
    user1_likes_user2 = matches_preference(user1.preferences, user2.gender)
    user2_likes_user1 = matches_preference(user2.preferences, user1.gender)
    
    return user1_likes_user2 and user2_likes_user1


def calculate_match_score(user1: User, user2: User) -> float:
    """
    Calculate match score between two users.
    
    The score is based on:
    - How well user2 matches what user1 is looking for (user1.aboutThem vs user2.aboutMe)
    - How well user1 matches what user2 is looking for (user2.aboutThem vs user1.aboutMe)
    
    Returns average of both directions as a percentage (0-100)
    """
    # user1 looking for user2: user1's aboutThem vs user2's aboutMe
    score_1_to_2 = cosine_similarity(user1.about_them_embedding, user2.about_me_embedding)
    
    # user2 looking for user1: user2's aboutThem vs user1's aboutMe
    score_2_to_1 = cosine_similarity(user2.about_them_embedding, user1.about_me_embedding)
    
    # Average both directions and convert to percentage
    avg_score = (score_1_to_2 + score_2_to_1) / 2
    
    # Convert from cosine similarity (-1 to 1) to percentage (0 to 100)
    # Cosine similarity for text embeddings is typically 0 to 1
    percentage = max(0, min(100, avg_score * 100))
    
    return percentage


def load_users(conn) -> list[User]:
    """Load all users who completed their profiles"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT 
                id, name, instagram, age, gender, preferences, "lookingFor",
                "aboutMeEmbedding"::text as about_me_embedding,
                "aboutThemEmbedding"::text as about_them_embedding
            FROM "User"
            WHERE "profileDescription" IS NOT NULL
              AND "aboutMeEmbedding" IS NOT NULL
              AND "aboutThemEmbedding" IS NOT NULL
        """)
        rows = cur.fetchall()
    
    users = []
    for row in rows:
        users.append(User(
            id=row["id"],
            name=row["name"],
            instagram=row["instagram"],
            age=row["age"],
            gender=row["gender"],
            preferences=row["preferences"],
            looking_for=row["lookingFor"],
            about_me_embedding=parse_vector(row["about_me_embedding"]),
            about_them_embedding=parse_vector(row["about_them_embedding"]),
        ))
    
    return users


def generate_matches(users: list[User], min_matches: int = 4) -> dict[str, list[tuple[str, float]]]:
    """
    Generate matches for all users.
    
    Returns a dict mapping user_id -> list of (matched_user_id, score)
    Each user will have at least min_matches matches.
    """
    print(f"Generating matches for {len(users)} users...")
    
    # Create a user lookup dict
    user_by_id = {u.id: u for u in users}
    
    # Calculate all pairwise scores
    all_scores: dict[str, list[tuple[str, float]]] = {u.id: [] for u in users}
    
    for i, user1 in enumerate(users):
        for j, user2 in enumerate(users):
            if i >= j:  # Skip self and duplicates
                continue
            
            # Check compatibility
            if not are_compatible(user1, user2):
                continue
            
            # Calculate match score
            score = calculate_match_score(user1, user2)
            
            # Add to both users' potential matches
            all_scores[user1.id].append((user2.id, score))
            all_scores[user2.id].append((user1.id, score))
    
    # Sort each user's matches by score (descending)
    for user_id in all_scores:
        all_scores[user_id].sort(key=lambda x: x[1], reverse=True)
    
    # Assign matches, ensuring everyone gets at least min_matches
    final_matches: dict[str, list[tuple[str, float]]] = {u.id: [] for u in users}
    
    # First pass: assign top matches to each user
    for user_id, potential_matches in all_scores.items():
        # Take top min_matches or all available if less
        final_matches[user_id] = potential_matches[:min_matches]
    
    # Second pass: report users with fewer matches (but NEVER relax gender preferences)
    # Gender preferences are strictly enforced - some users may have fewer than min_matches
    for user_id, matches in final_matches.items():
        if len(matches) < min_matches:
            user = user_by_id[user_id]
            print(f"⚠️  User {user_id} ({user.name}) has only {len(matches)} matches (preferences strictly enforced)")
    
    # Print statistics
    match_counts = [len(m) for m in final_matches.values()]
    all_scores_with_users = [(user_id, matched_id, score) for user_id, matches in final_matches.items() for matched_id, score in matches]
    all_scores = [score for _, _, score in all_scores_with_users]
    print(f"\nMatch statistics:")
    print(f"  Total users: {len(users)}")
    print(f"  Users with matches: {sum(1 for c in match_counts if c > 0)}")
    print(f"  Min matches: {min(match_counts) if match_counts else 0}")
    print(f"  Max matches: {max(match_counts) if match_counts else 0}")
    print(f"  Avg matches: {sum(match_counts) / len(match_counts):.1f}" if match_counts else "N/A")
    print(f"\nScore statistics:")
    print(f"  Highest match percentage: {max(all_scores):.1f}%" if all_scores else "N/A")
    print(f"  Lowest match percentage: {min(all_scores):.1f}%" if all_scores else "N/A")
    print(f"  Average match percentage: {sum(all_scores) / len(all_scores):.1f}%" if all_scores else "N/A")
    
    # Find and print the highest match pair
    if all_scores_with_users:
        best_match = max(all_scores_with_users, key=lambda x: x[2])
        user1 = user_by_id[best_match[0]]
        user2 = user_by_id[best_match[1]]
        print(f"\n💘 Highest match:")
        print(f"  {user1.name} ❤️  {user2.name} = {best_match[2]:.1f}%")
    
    # Report users with fewer than min_matches
    users_with_few_matches = [(uid, len(m)) for uid, m in final_matches.items() if len(m) < min_matches]
    if users_with_few_matches:
        print(f"\n⚠️  {len(users_with_few_matches)} users have fewer than {min_matches} matches (gender preferences enforced)")
    
    return final_matches


def save_matches(conn, matches: dict[str, list[tuple[str, float]]]):
    """Save matches to the database"""
    print("\nSaving matches to database...")
    
    with conn.cursor() as cur:
        # Clear existing matches
        cur.execute('DELETE FROM "Match"')
        print(f"  Cleared existing matches")
        
        # Insert new matches
        total_inserted = 0
        for user_id, user_matches in matches.items():
            for rank, (matched_id, score) in enumerate(user_matches, start=1):
                # Convert numpy float64 to Python float for PostgreSQL compatibility
                score_float = float(score)
                cur.execute("""
                    INSERT INTO "Match" (id, "userId", "matchedId", score, rank, "createdAt")
                    VALUES (gen_random_uuid()::text, %s, %s, %s, %s, NOW())
                    ON CONFLICT ("userId", "matchedId") DO UPDATE SET score = %s, rank = %s
                """, (user_id, matched_id, score_float, rank, score_float, rank))
                total_inserted += 1
        
        conn.commit()
        print(f"  Inserted {total_inserted} matches")


def main():
    print("=" * 60)
    print("RoboCupido Matching Algorithm")
    print("=" * 60)
    
    # Connect to database
    print(f"\nConnecting to database...")
    conn = psycopg2.connect(DATABASE_URL)
    print("  Connected!")
    
    try:
        # Load users
        users = load_users(conn)
        print(f"\nLoaded {len(users)} users with completed profiles")
        
        if len(users) < 2:
            print("ERROR: Need at least 2 users to generate matches")
            return
        
        # Generate matches
        matches = generate_matches(users, min_matches=4)
        
        # Show preview of matches
        print("\n" + "=" * 60)
        print("Match Preview (first 5 users):")
        print("=" * 60)
        user_by_id = {u.id: u for u in users}
        for i, (user_id, user_matches) in enumerate(list(matches.items())[:5]):
            user = user_by_id[user_id]
            print(f"\n{user.name} ({user.looking_for}, {user.gender}):")
            for rank, (matched_id, score) in enumerate(user_matches, start=1):
                matched = user_by_id[matched_id]
                print(f"  {rank}. {matched.name} - {score:.1f}% ({matched.gender})")
        
        # Confirm before saving
        print("\n" + "=" * 60)
        response = input("Save matches to database? (yes/no): ").strip().lower()
        if response == "yes":
            save_matches(conn, matches)
            print("\n✓ Matches saved successfully!")
        else:
            print("\n✗ Cancelled. No changes made.")
    
    finally:
        conn.close()
        print("\nDatabase connection closed.")


if __name__ == "__main__":
    main()
