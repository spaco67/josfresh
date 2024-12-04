import { withAuth } from "next-auth/middleware";

// Protect dashboard routes
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/dashboard/:path*"]
};