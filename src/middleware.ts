import NextAuth from "next-auth";
import { authConfigBase } from "~/server/auth/config.edge";

const { auth } = NextAuth(authConfigBase);

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/questionnaire/:path*", "/chat/:path*"],
};
