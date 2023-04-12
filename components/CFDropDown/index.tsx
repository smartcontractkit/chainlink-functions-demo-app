import { Fragment, useState } from 'react';
import styles from './CFDropDown.module.css';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
interface Option {
  name: string;
}
interface Props {
  options: Option[];
  defaultValue: Option;
  onChange?: (value: Option) => void;
}
const CFDropDown = ({ options, defaultValue, onChange }: Props) => {
  const [selected, setSelected] = useState(defaultValue);

  const handleOnChange = (value: Option) => {
    setSelected(value);
    onChange && onChange(value);
  };

  if (options.length == 0) {
    return null;
  }

  return (
    <Listbox value={selected} onChange={handleOnChange}>
      <div className="relative mt-1 group">
        <Listbox.Button className={styles.list_btn}>
          <span className="block truncate text-gray-200">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={styles.options}>
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={() =>
                  classNames(styles.option, {
                    'bg-gray-700': selected.name === option.name,
                  })
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={classNames('block truncate', {
                        'font-medium': selected,
                        'font-normal': !selected,
                      })}
                    >
                      {option.name}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default CFDropDown;
