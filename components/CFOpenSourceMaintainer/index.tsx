import Image from 'next/image';
import styles from './CFOpenSourceMaintainer.module.css';
import classNames from 'classnames';

interface Props {
  isNav?: boolean;
}

const CFOpenSourceMaintainer = ({ isNav }: Props) => {
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
          <span className={questionClasses}>
            Are you an open source maintainer?
          </span>
          <span className={claimClasses}>Claim your donations</span>
        </div>
      </div>
      {!isNav && (
        <button className={styles.btn}>
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
