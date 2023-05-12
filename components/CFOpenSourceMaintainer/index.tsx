import Image from 'next/image';
import classNames from 'classnames';
import { useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';

import styles from './CFOpenSourceMaintainer.module.css';
import { useMetaMask } from '../../hooks/useMetaMask';
import { useClaim } from '../../hooks/useClaim';

interface Props {
  isNav?: boolean;
  closeAlert?: () => void;
}

const CFOpenSourceMaintainer = ({ isNav, closeAlert }: Props) => {
  const { state } = useMetaMask();
  const { claim, amount, isClaiming } = useClaim();

  const containerClasses = classNames(styles.container, {
    'py-2': isNav,
    'py-3': !isNav,
  });
  const questionClasses = classNames(styles.question, {
    'font-normal': isNav,
    'font-medium': !isNav,
  });
  const claimClasses = classNames(styles.claim, {
    'font-normal': isNav,
    'font-semibold': !isNav,
  });

  const handleOpenMaintainerAlert = () => {
    window.sessionStorage.setItem('openM', 'true');
    closeAlert && closeAlert();
  };

  /**
   * The next effect and handler combine to build the full payout flow.
   *
   * On click the handler will kick off the authentication process to ensure the end-user is the true owner of its
   * GitHub repositories. On the oAuth callback flow the effect will kick in and trigger the payout logic on our server.
   * It needs to watch the state as there is a race condition between the effect and the wallet being registered in the
   * state.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(claim, [state]);

  const handleClaim = () => {
    (async () => {
      const providers = { ...(await getProviders()) };
      await signIn(Object.values(providers)[0].id, {
        callbackUrl: '/?claim=continue',
      });
    })();
  };
  /** End claim flow */

  return (
    <div className={containerClasses}>
      <div className={styles.content}>
        {!isNav && (
          <Image
            width={24}
            height={24}
            src="./icons/info.svg"
            alt="info icon"
          />
        )}
        <div className={styles.question_claim}>
          {isClaiming && amount == null ? (
            <span className={questionClasses}>checking ...</span>
          ) : amount == null ? (
            <>
              <span className={questionClasses}>
                Are you an open source maintainer?
              </span>
              <button className={claimClasses} onClick={handleClaim}>
                Claim your donations
              </button>
            </>
          ) : amount === 0 ? (
            <span className={questionClasses}>
              No donations available for your repositories. Check back later.
            </span>
          ) : (
            <span className={questionClasses}>
              We&apos;ve transferred {amount} MATIC to your account
            </span>
          )}
        </div>
      </div>
      {!isNav && (
        <button className={styles.btn} onClick={handleOpenMaintainerAlert}>
          <Image
            width={24}
            height={24}
            src="./icons/close.svg"
            alt="close icon"
          />
        </button>
      )}
    </div>
  );
};

export default CFOpenSourceMaintainer;
