import classNames from 'classnames';
import styles from './CFButton.module.css';

interface Props {
  text: string;
  disabled?: boolean;
  size?: 'md' | 'lg';
  onClick?: () => void;
}

const CFButton = ({ text, size, onClick, disabled, ...rest }: Props) => {
  const btnClasses = classNames(styles.button_wrapper, {
    [styles.button_md_wrapper]: size === 'md',
  });
  return (
    <button className={btnClasses} disabled={disabled} onClick={onClick} {...rest}>
      {text}
    </button>
  );
};

export default CFButton;
