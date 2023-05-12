import Image from 'next/image';
import styles from './CFUser.module.css';
import { useMetaMask } from '../../hooks/useMetaMask';
import { useSession } from 'next-auth/react';

const CFUser = () => {
  const {
    state: { wallet, balance },
  } = useMetaMask();
  const { data: session } = useSession();
  const slicedWallet = wallet?.slice(0, 6) + '...' + wallet?.slice(-4);
  const calcBalance = (parseInt(balance || '') / 1000000000000000000).toFixed(
    4
  );
  const imageUrl =
    session && session?.user?.image
      ? session?.user?.image
      : './icons/avatar.svg';

  return (
    <div className={styles.user_wrapper}>
      <span className={styles.balance}>{calcBalance} MATIC</span>
      <div className={styles.wallet_avatar}>
        <span>{slicedWallet}</span>
        <Image
          width={24}
          height={24}
          src={imageUrl}
          className="rounded-full"
          alt="avatar"
        />
        <Image width={12} height={12} src="./icons/caret.svg" alt="caret" />
      </div>
    </div>
  );
};

export default CFUser;
