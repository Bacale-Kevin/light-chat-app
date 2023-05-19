import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/users/:path*", //protect all the routes inside the user route
    "/conversations/:path*"
  ],
};
