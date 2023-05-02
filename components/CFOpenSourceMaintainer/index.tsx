import Image from 'next/image';
import styles from './CFOpenSourceMaintainer.module.css';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useMetamask } from '../../hooks/useMetamask';
import { signIn } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useClaim } from '../../hooks/useClaim';

interface Props {
  isNav?: boolean;
  closeAlert?: () => void;
}

const CFOpenSourceMaintainer = ({ isNav, closeAlert }: Props) => {
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

  useEffect(() => claim, []);
  const handleClaim = () => {
    signIn('GitHub', {
      callbackUrl: '/?claim=continue',
    });
  };

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
              Sorry, it seems like there aren&apos;t any donations made to your
              repositories. Make sure to check back later!
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
