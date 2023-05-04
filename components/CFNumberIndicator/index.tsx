import cn from 'classnames';
import styles from './CFNumberIndicator.module.css';

interface IProps {
  count: number;
  status: 'done' | 'in progress' | 'pending'
}

const CFNumberIndicator = ({count, status}: IProps) => {
  const indicatorClass = cn(styles.wrapper, {
    'text-gray-800 border-blue-200 bg-blue-200': status === 'done',
    'text-blue-200 border-blue-200 bg-white-50': status === 'in progress',
    'text-gray-300 border-gray-600 bg-white-50':
      status === 'pending' || (status !== 'done' && status !== 'in progress'),
  });
  return (
    <span className={indicatorClass}>{count}</span>
  )
};

export default CFNumberIndicator;
