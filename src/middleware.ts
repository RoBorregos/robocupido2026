import NextAuth from "next-auth";
import { authConfigBase } from "~/server/auth/config.edge";

const { auth } = NextAuth(authConfigBase);

// Registration is closed - users who didn't complete their profile see the ended page
const REGISTRATION_CLOSED = true;

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // If user is not authenticated
  if (!req.auth) {
    // Redirect to home page (not login) as per user request
    const homeUrl = new URL("/", req.url);
    return Response.redirect(homeUrl);
  }
  
  // If registration is closed, redirect questionnaire and chat to registration-ended
  // Users will be redirected to waiting if they completed their profile (handled in the page)
  if (REGISTRATION_CLOSED && (pathname.startsWith("/questionnaire") || pathname.startsWith("/chat"))) {
    const registrationEndedUrl = new URL("/registration-ended", req.url);
    return Response.redirect(registrationEndedUrl);
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
    "/registration-ended/:path*",
    "/matches/:path*",
  ],
};
