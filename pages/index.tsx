import { useEffect, Fragment } from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Wallet from '@components/Wallet';
import Navbar from '@components/Navbar';
import { useListen } from '../hooks/useListen';
import { useMetamask } from '../hooks/useMetamask';
import { GetServerSidePropsContext } from 'next/types';
import RepoForm from '@components/RepoForm';

interface IndexPageProps {
  user: User;
}

export default function IndexPage({ user }: IndexPageProps) {
  const { dispatch } = useMetamask();
  const listen = useListen();

  useEffect(() => {
    if (typeof window !== undefined) {
      // start by checking if window.ethereum is present, indicating a wallet extension
      const ethereumProviderInjected = typeof window.ethereum !== 'undefined';
      // this could be other wallets so we can verify if we are dealing with metamask
      // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
      const isMetamaskInstalled =
        ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

      const local = window.localStorage.getItem('metamaskState');

      // user was previously connected, start listening to MM
      if (local) {
        listen();
      }

      // local could be null if not present in LocalStorage
      const { wallet, balance } = local
        ? JSON.parse(local)
        : // backup if local storage is empty
          { wallet: null, balance: null };

      dispatch({ type: 'pageLoaded', isMetamaskInstalled, wallet, balance });
    }
  }, []);

  return (
    <>
      <Navbar />
      <Wallet />
      <RepoForm />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  return {
    props: { user: session?.user ?? null },
  };
}
