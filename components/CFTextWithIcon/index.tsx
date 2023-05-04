import Image from "next/image";
import cn from 'classnames';
import styles  from './CFTextWithIcon.module.css';

interface IProps {
  text: string;
  tip: string;
}
const CFTextWithIcon = ({text, tip}: IProps) => {
  return (
    <span className={styles.wrapper}>
      <small>{text}</small>
      <span className="relative group">
        <Image width={13} height={13} src="./icons/help-tip.svg" alt={text} />
        <div className={cn(styles.tip, 'hidden group-hover:flex')}>{tip}</div>
      </span>
    </span>
  );
};

export default CFTextWithIcon;
