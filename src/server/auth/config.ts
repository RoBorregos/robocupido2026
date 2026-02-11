import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";

import { db } from "~/server/db";
import { authConfigBase } from "./config.edge";

export { authConfigBase };

/**
 * Full config with Prisma adapter — used server-side only.
 */
export const authConfig = {
  ...authConfigBase,
  adapter: PrismaAdapter(db as any),
} satisfies NextAuthConfig;
