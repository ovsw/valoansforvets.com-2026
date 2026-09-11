import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/crm/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/__clerk/:path*",
  ],
};
