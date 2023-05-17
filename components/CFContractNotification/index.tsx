import { CheckIcon } from '@heroicons/react/24/outline';
import styles from './CFContractNotification.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import CFButton from '@components/CFButton';

type Status = 'success' | 'fail';
interface Props {
  status: Status;
  onClear: () => void;
  content: Record<Status, { message: string; btnText: string }>;
}

const CFContractNotification = ({ status, onClear, content }: Props) => {
  const circleClasses = classNames(styles.circle, {
    'bg-green-300': status === 'success',
    'bg-red-300': status === 'fail',
  });
  const data = content[status];

  return (
    <div className={styles.card}>
      <div className={styles.outer_circle}>
        <div className={circleClasses}>
          {status === 'fail' ? (
            <Image
              width={30}
              height={20}
              src="./icons/sad.svg"
              alt="sad face"
              className="transform translate-y-3"
            />
          ) : (
            <CheckIcon className="w-10 h-10" />
          )}
        </div>
      </div>
      <div className={styles.message}>{data.message}</div>

      <CFButton size="md" text={data.btnText} onClick={onClear} />
    </div>
  );
};

export default CFContractNotification;
