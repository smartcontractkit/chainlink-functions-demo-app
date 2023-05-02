import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import UserProfileDropDown from './UserProfileDropDown';
import CFButton from './CFButton';
import CFOpenSourceMaintainer from './CFOpenSourceMaintainer';
import { useListen } from 'hooks/useListen';
import { useMetamask } from 'hooks/useMetamask';
import Link from 'next/link';

interface Props {
  isOpenM: boolean;
}
export default function Navbar({ isOpenM }: Props) {
  // NextAuth Session Data
  const { data: session, status } = useSession();

  const {
    dispatch,
    state: { status: metaStatus, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();

  const showInstallMetamask =
    metaStatus !== 'pageNotLoaded' && !isMetamaskInstalled;

  const handleConnect = async () => {
    dispatch({ type: 'loading' });
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length > 0) {
      const balance = await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });

      dispatch({ type: 'connect', wallet: accounts[0], balance });

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };
  return (
    <Disclosure as="nav" className="bg-transparent">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    height={40}
                    width={122}
                    className="h-8 w-full"
                    src="./icons/logo.svg"
                    alt="Your Company"
                  />
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-2">
                {/* Profile dropdown */}
                <Transition
                  show={isOpenM && Boolean(session && session?.user)}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 translate-y-full"
                  enterTo="transform opacity-100 translate-y-0"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 translate-y-0"
                  leaveTo="transform opacity-0 translate-y-full"
                >
                  <CFOpenSourceMaintainer isNav={true} />
                </Transition>
                {balance ? (
                  <UserProfileDropDown />
                ) : (
                  <>
                    {showInstallMetamask ? (
                      <Link
                        href="https://metamask.io/"
                        target="_blank"
                        className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
                      >
                        Install Metamask
                      </Link>
                    ) : (
                      <CFButton
                        text="Connect wallet"
                        size="md"
                        onClick={handleConnect}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
