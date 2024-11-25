import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  // Add Google Provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline", // Refresh token support
          response_type: "code",
        },
      },
    }),
  ],

  // Callbacks for handling user session and redirects
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to the home page after sign-in
      return baseUrl; // Redirect to `/` (baseUrl is your app's root URL)
    },
    async signOut() {
      // Redirect to landing page after sign-out
      return "/Landingpage"; // Ensure the `/Landingpage` route exists
    },
    async session({ session, token }) {
      // Add user ID or additional data to the session object if needed
      session.user.id = token.sub;
      return session;
    },
  },

  // Security settings
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env.local

  // Debugging (optional: remove in production)
  debug: true,
});

export { handler as GET, handler as POST };
