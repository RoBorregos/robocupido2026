import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import type { PrismaClient } from "@prisma/client";

import { db } from "~/server/db";
import { authConfigBase } from "./config.edge";

export { authConfigBase };

/**
 * Full config with Prisma adapter — used server-side only.
 */
export const authConfig = {
  ...authConfigBase,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(db as unknown as PrismaClient),
} satisfies NextAuthConfig;
