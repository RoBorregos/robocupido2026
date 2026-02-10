import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";

const createPrismaClient = () =>
  new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Find the top-N matches for a user by comparing their aboutThemEmbedding
 * (what they want) against other users' aboutMeEmbedding (who they are).
 */
export async function findSimilarUsers(
  userId: string,
  aboutThemEmbedding: number[],
  limit = 10,
) {
  const vectorStr = `[${aboutThemEmbedding.join(",")}]`;
  return db.$queryRawUnsafe<
    { id: string; name: string | null; email: string | null; similarity: number }[]
  >(
    `SELECT id, name, email, 1 - ("aboutMeEmbedding" <=> $1::vector) AS similarity
     FROM "User"
     WHERE id != $2 AND "aboutMeEmbedding" IS NOT NULL
     ORDER BY "aboutMeEmbedding" <=> $1::vector
     LIMIT $3`,
    vectorStr,
    userId,
    limit,
  );
}
