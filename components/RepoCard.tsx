import {
  EyeIcon,
  StarIcon,
  CodeBracketSquareIcon,
} from '@heroicons/react/24/outline';

import { Owner, Repo } from 'hooks/useGithubRepo';
import Image from 'next/image';

const person = {
  name: 'Jane Cooper',
  title: 'Regional Paradigm Technician',
  role: 'Admin',
  email: 'janecooper@example.com',
  telephone: '+1-202-555-0170',
  imageUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
};

interface RepoCardProps {
  repo: Repo;
  owner: Owner;
}

export default function RepoCard({ repo, owner }: RepoCardProps) {
  return (
    <div
      key={person.email}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 ">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {owner.login}
            </h3>
            <span className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              {person.role}
            </span>
          </div>
          <div className="text-left">
            <span className="mt-1 break-normal inline-block text-sm text-gray-500">
              {repo.description}
            </span>
          </div>
        </div>
        <Image
          width={10}
          height={10}
          className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
          src={owner.avatarUrl}
          alt=""
        />
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <span className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
              <StarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Star
              <span className="inline-flex items-center justify-center h-5 w-15 px-2 py-1 mr-2 text-xs font-bold leading-none text-gray-100 bg-gray-400 rounded-full">
                {repo.starCount}
              </span>
            </span>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <span className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
              <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Watch
              <span className="inline-flex items-center justify-center h-5 w-15 px-2 py-1 mr-2 text-xs font-bold leading-none text-gray-100 bg-gray-400 rounded-full">
                {repo.watchCount}
              </span>
            </span>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <span className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
              <CodeBracketSquareIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              Fork
              <span className="inline-flex items-center justify-center h-5 w-15 px-2 py-1 mr-2 text-xs font-bold leading-none text-gray-100 bg-gray-400 rounded-full">
                {repo.forkCount}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
