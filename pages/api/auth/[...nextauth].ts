// @ts-nocheck
import NextAuth, { Session, Account, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      token: JWT;
      session: Session;
      user: User;
    }): Promise<Session> {
      session.user.id = token.id as number;
      session.user.token = token.accessToken;
      return session;
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      account: Account;
      user: User;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
