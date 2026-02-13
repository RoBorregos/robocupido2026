import NextAuth from "next-auth";
import { authConfigBase } from "~/server/auth/config.edge";

const { auth } = NextAuth(authConfigBase);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // If user is not authenticated
  if (!req.auth) {
    // Redirect to home page (not login) as per user request
    const homeUrl = new URL("/", req.url);
    return Response.redirect(homeUrl);
  }
  
  // User is authenticated - allow access
  return;
});

export const config = {
  // Protect all routes that require authentication
  matcher: [
    "/questionnaire/:path*", 
    "/chat/:path*", 
    "/waiting/:path*",
    "/avatar/:path*",
    "/logout/:path*",
  ],
};
