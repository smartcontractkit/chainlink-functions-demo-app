import { SessionProvider } from 'next-auth/react';
import { MetamaskProvider } from '../hooks/useMetamask';
import { GithubRepoProvider } from '../hooks/useGithubRepo';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ClaimProvider } from '../hooks/useClaim';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <ClaimProvider>
        <GithubRepoProvider>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <Component {...pageProps} />
          </SessionProvider>
        </GithubRepoProvider>
      </ClaimProvider>
    </MetamaskProvider>
  );
}
