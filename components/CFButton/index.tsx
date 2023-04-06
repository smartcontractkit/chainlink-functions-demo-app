import classNames from 'classnames';
import styles from './CFButton.module.css';

interface Props {
  text: string;
  isDisabled?: boolean;
  size?: 'sm' | 'lg';
}

const CFButton = ({ text, size, isDisabled }: Props) => {
  const btnClasses = classNames(styles.button_wrapper, {
    [styles.button_sm_wrapper]: size === 'sm',
  });
  return (
    <button className={btnClasses} disabled={isDisabled}>
      {text}
    </button>
  );
};

export default CFButton;
