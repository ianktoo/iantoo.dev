import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.githubId = String((profile as { id?: number }).id ?? "");
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { githubId?: string }).githubId = token.githubId as string;
      }
      return session;
    },
  },
});

export type AppSession = {
  user?: { githubId?: string; name?: string | null; email?: string | null; image?: string | null };
  expires: string;
} | null;

export function isAdmin(session: AppSession): boolean {
  if (!session?.user) return false;
  return session.user.githubId === process.env.ADMIN_GITHUB_ID;
}
