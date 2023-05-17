import cn from 'classnames';
import styles from './CFNumberIndicator.module.css';

interface IProps {
  count: number;
  status: 'done' | 'in progress' | 'pending';
}

const CFNumberIndicator = ({ count, status }: IProps) => {
  const indicatorClass = cn(styles.wrapper, {
    'border-blue-200': status === 'done',
    'border-blue-200 border-dashed animate-spin-slow': status === 'in progress',
    'border-gray-600':
      status === 'pending' || (status !== 'done' && status !== 'in progress'),
  });
  const textClass = cn(styles.wrapper, 'border-none', 'absolute', 'top-0', {
    'text-gray-800 bg-blue-200': status === 'done',
    'text-blue-200 bg-white-50': status === 'in progress',
    'text-gray-300 bg-white-50':
      status === 'pending' || (status !== 'done' && status !== 'in progress'),
  });
  return (
    <div className="relative">
      <span className={textClass}>{count}</span>
      <span className={indicatorClass}></span>
    </div>
  );
};

export default CFNumberIndicator;
