SELECT 
    u1.id AS current_user_id,
    u1.name AS current_user_name,
    u1.instagram as current_insta,
    u2.id AS candidate_id,
    u2.name AS candidate_name,
    u2.instagram as candidate_insta,
    1 - (u1."aboutThemEmbedding" <=> u2."aboutMeEmbedding") as cosine_similarity
FROM "User" u1
JOIN "User" u2 
    ON u1.id != u2.id  
WHERE 
    u2.gender = ANY(regexp_split_to_array(u1.preferences, '\s*,\s*'))
    AND u1.gender = ANY(regexp_split_to_array(u2.preferences, '\s*,\s*'))
    AND u1."aboutThemEmbedding" IS NOT NULL 
    AND u2."aboutMeEmbedding" IS NOT NULL
    AND (1 - (u1."aboutThemEmbedding" <=> u2."aboutMeEmbedding")) >= 0.4 
ORDER BY cosine_similarity DESC;