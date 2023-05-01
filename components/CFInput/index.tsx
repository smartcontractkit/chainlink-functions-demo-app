import { ChangeEvent, useCallback, useState } from 'react';
import styles from './CFInput.module.css';
import classNames from 'classnames';
import Image from 'next/image';

interface Props {
  type: 'url' | 'text';
  iconType?: 'matic' | 'link' | null;
  placeholder: string;
  onInput: (value: string) => void;
  base?: string;
}

const CFInput = ({ type, iconType, placeholder, onInput, base }: Props) => {
  const [error, setError] = useState(false);
  const [onFocus, setOnFocus] = useState(false);
  const [value, setValue] = useState<string | number>('');
  const containerClasses = classNames(styles.container);
  const inputContainerClasses = classNames(styles.input_container, {
    'border-red-500': error,
    'border-blue-200': onFocus,
    'border-white-alpha-300': !error && !onFocus,
  });

  const handleBlur = useCallback(() => {
    if (typeof value === 'string') {
      setError(value.trim().length === 0 ? true : false);
    } else {
      setError(value === 0 ? true : false);
    }
    setOnFocus(false);
  }, [value]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value.trim();
    setValue(str);
    onInput(str);
    setError(str.length === 0 ? true : false);
  };
  const getIcon = () => {
    if (iconType === 'matic') {
      return (
        <div className={styles.icon_with_text}>
          <Image
            width={20}
            height={20}
            src="./icons/matic.svg"
            alt="matic icon"
          />
          <span>Matic</span>
        </div>
      );
    } else if (iconType === 'link') {
      return (
        <Image width={20} height={20} src="./icons/link.svg" alt="matic icon" />
      );
    }
    return null;
  };

  return (
    <div className={containerClasses}>
      <div className={inputContainerClasses}>
        {getIcon()}
        <input
          type={type}
          onFocus={() => {
            setOnFocus(true);
            setError(false);
          }}
          onBlur={handleBlur}
          onInput={handleInput}
          className={styles.input}
          placeholder={placeholder}
          value={base}
        />
      </div>
      {error && (
        <span className={styles.missing_field}>Fill in this field</span>
      )}
    </div>
  );
};

export default CFInput;
