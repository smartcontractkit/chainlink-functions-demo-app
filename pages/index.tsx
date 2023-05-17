import { useEffect } from 'react';
import Navbar from '@components/Navbar';
import { useListen } from '../hooks/useListen';
import { useMetaMask } from '../hooks/useMetaMask';
import ContractSection from 'sections/ContractSection';
import ClaimSection from 'sections/ClaimSection';
import About from 'sections/About';

export default function IndexPage() {
  const { dispatch } = useMetaMask();
  const listen = useListen();

  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== 'undefined';
      // this could be other wallets, so we can verify if we are dealing with MetaMask
      // using the boolean constructor to be explicit and not let this be used as a falsy value (optional)
      const isMetaMaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem('MetaMaskState');

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null };

      dispatch({
        type: 'pageLoaded',
        isMetaMaskInstalled: isMetaMaskInstalled,
        wallet,
        balance,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full max-w-[1440px] px-4 lg:px-8 pt-4 mx-auto">
        <ContractSection />
        <ClaimSection />
        <About />
      </div>
      <div className="gradients green_gradient"></div>
      <div className="gradients blue_gradient"></div>
    </>
  );
}
