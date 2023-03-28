import { SessionProvider } from 'next-auth/react';
import { MetamaskProvider } from '../hooks/useMetamask';

import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    </MetamaskProvider>
  );
}
