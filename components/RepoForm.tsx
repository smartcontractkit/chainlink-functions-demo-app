import { useRef } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

import RepoCard from '@components/RepoCard';
import useKeyFocus from 'hooks/useKeyFocus';
import { useGithubRepo } from 'hooks/useGithubRepo';

export default function RepoForm() {
  const repoInputRef = useRef<HTMLInputElement>(null);
  const { dispatch, state, fetchRepo } = useGithubRepo();
  useKeyFocus(75, repoInputRef);

  function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault();
    fetchRepo();
  }

  return (
    <div className="mx-auto max-w-2xl py-4 px-4 text-center sm:py-10 sm:px-6 lg:px-8">
      <label htmlFor="search" className="block text-sm font-medium leading-6">
        Github Repository URL
      </label>
      <form className="my-5 sm:flex sm:items-center" onSubmit={handleOnSubmit}>
        <div className="relative flex items-center w-full">
          <input
            ref={repoInputRef}
            type="text"
            name="repoUrl"
            aria-invalid="true"
            aria-describedby="input-error"
            value={state.searchInput}
            onChange={(e) =>
              dispatch({
                type: 'searchInput',
                inputValue: e.currentTarget.value,
              })
            }
            className="peer block w-full rounded-md border-0 py-1.5 pr-14 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div className="absolute inset-y-0 right-0 flex">
            {state.searchInput && (
              <button
                onClick={() =>
                  dispatch({
                    type: 'resetInput',
                  })
                }
                className="inline-flex items-center px-1 font-sans text-xs text-gray-400"
              >
                <XCircleIcon className="h-5" />
              </button>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
        >
          Search
        </button>
      </form>
      {state.status === 'error' && (
        <p className="mt-2 text-sm text-red-600" id="repoUrl-error">
          Not a valid repo URL address.
        </p>
      )}
      {/* Render RepoCard when state available */}
      {state?.repo && state?.owner && (
        <RepoCard repo={state.repo} owner={state.owner} />
      )}
    </div>
  );
}
