import Image from 'next/image';
import styles from './CFIconLabel.module.css';

interface Props {
  icon: string;
  text: string;
}

const CFIconLabel = ({icon, text}: Props) => {
  return (
    <div className={styles.container}>
      <Image width={20} height={20} alt={`${icon} icon`} src={`./icons/${icon}.svg`} />
      <span className={styles.content}>{text}</span>
    </div>
  );
};

export default CFIconLabel;
