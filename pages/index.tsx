import { useEffect, Fragment, useState } from 'react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import Wallet from '@components/Wallet';
import Navbar from '@components/Navbar';
import { useListen } from '../hooks/useListen';
import { useMetamask } from '../hooks/useMetamask';
import { GetServerSidePropsContext } from 'next/types';
import RepoForm from '@components/RepoForm';
import CFOpenSourceMaintainer from '@components/CFOpenSourceMaintainer';
import { Transition } from '@headlessui/react';

interface IndexPageProps {
  user: User;
}

export default function IndexPage({ user }: IndexPageProps) {
  const { dispatch } = useMetamask();
  const [isOpenM, setIsOpenM] = useState(false);
  const listen = useListen();

  useEffect(() => {
    if (typeof window !== undefined) {
      const openM = Boolean(window.sessionStorage.getItem('openM'));
      setIsOpenM(openM);
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
      <Navbar isOpenM={isOpenM} />
      <div className="w-full max-w-[1440px] px-4 lg:px-8">
        <Transition
          show={!isOpenM}
          enter="transition ease-out duration-75"
          enterFrom="transform opacity-0 -translate-y-full"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-full"
        >
          <CFOpenSourceMaintainer closeAlert={() => setIsOpenM(true)} />
        </Transition>
      </div>
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
