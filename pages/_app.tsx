import type { AppProps } from 'next/app';
import Script from 'next/script';

import { MetaMaskProvider } from '../hooks/useMetaMask';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-EGSL8E4K3V"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
        `}
      </Script>
      <MetaMaskProvider>
        <Component {...pageProps} />
      </MetaMaskProvider>
    </>
  );
}
