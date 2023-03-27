import {
  useEvmNativeBalance,
  useEvmWalletTokenBalances,
} from '@moralisweb3/next';
import { EvmChain } from 'moralis/common-evm-utils';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const chain = EvmChain.MUMBAI;

export default function HomePage({ user }) {
  const address = user?.address;
  const { data: nativeBalance } = useEvmNativeBalance({ address, chain });

  console.log(address, nativeBalance);
  return !user ? (
    <Link href="/signin">Sign in</Link>
  ) : (
    <div>
      <h3>Wallet: {address}</h3>
      <h3>Native Balance: {nativeBalance?.balance.ether} ETH</h3>

      <button onClick={() => signOut({ redirect: '/signin' })}>Sign out</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { user: session?.user ?? null },
  };
}
