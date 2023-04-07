import Image from "next/image";
import styles from "./CFUser.module.css";
import { useMetamask } from "hooks/useMetamask";

const CFUser = () => {
   const {
     state: { wallet, balance },
   } = useMetamask();
  const slicedWallet = wallet?.slice(0,6) + '...' + wallet?.slice(-4);
  const calcBalance = (parseInt(balance || '') / 1000000000000000000).toFixed(4);

  return (
    <div className={styles.user_wrapper}>
      <span>{calcBalance}</span>
      <div className={styles.wallet_avatar}>
        <span>{slicedWallet}</span>
        <Image width={24} height={24} src="./icons/avatar.svg" alt="avatar" />
      </div>
    </div>
  );
};

export default CFUser;
