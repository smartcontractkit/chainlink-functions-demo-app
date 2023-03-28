import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET as string,
    }),
  ],
};

export default NextAuth(authOptions);
