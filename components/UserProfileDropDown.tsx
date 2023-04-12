import { Fragment } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import CFUser from './CFUser';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function UserProfileDropDown() {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex rounded-md bg-gray-800 text-sm focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <CFUser />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/api/auth/signout"
                className={classNames(
                  active ? 'bg-gray-700' : 'bg-gray-800',
                  'block px-4 py-3 text-sm text-white'
                )}
              >
                Sign out
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
