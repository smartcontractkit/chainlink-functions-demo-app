import React, { type PropsWithChildren } from 'react';
import { useSession } from 'next-auth/react';

type IdleAction = { type: 'idle' };
type LoadingAction = { type: 'loading' };
type InputAction = { type: 'searchInput'; inputValue: string };
type SetRepo = { type: 'setRepo'; repo: Repo; owner: Owner };

type Action = LoadingAction | IdleAction | InputAction | SetRepo;

type Dispatch = (action: Action) => void;

type Status = 'loading' | 'idle' | 'error';

type Owner = {
  login: string;
  id: number;
  avatarUrl: string;
  htmlUrl: string;
};

type Repo = {
  id: number;
  name: string;
  description: null | string;
  htmlUrl: string;
  starCount: number;
  watchCount: number;
  forkCount: number;
};

type State = {
  searchInput: string;
  repo: Repo | null;
  status: Status;
  owner: Owner | null;
};
const initialState: State = {
  searchInput: '',
  repo: null,
  owner: null,
  status: 'idle',
};

// https://github.com/smartcontractkit/functions-hardhat-starter-kit
function parseRepoSearchInput(input: string): string[] | null {
  try {
    const url = new URL(input);
    if (url.hostname !== 'github.com')
      throw new Error('Invalid host URL, must be `github.com`');

    return url.pathname.substring(1).split('/');
  } catch (error) {
    console.log(error); // => TypeError, "Failed to construct URL: Invalid URL"
    return null;
  }
}

function githubRepoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'searchInput': {
      return { ...state, searchInput: action.inputValue };
    }
    case 'idle': {
      return { ...state, status: 'idle' };
    }
    case 'loading': {
      return { ...state, status: 'loading' };
    }
    case 'setRepo': {
      return { ...state, repo: action.repo, owner: action.owner };
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
}

const GithubRepoContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function GithubRepoProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = React.useReducer(githubRepoReducer, initialState);
  const value = { state, dispatch };

  return (
    <GithubRepoContext.Provider value={value}>
      {children}
    </GithubRepoContext.Provider>
  );
}

function useGithubRepo() {
  const { data: session } = useSession();
  const context = React.useContext(GithubRepoContext);
  if (context === undefined) {
    throw new Error('useGithubRepo must be used within a GithubRepoProvider');
  }
  const { dispatch, state } = context;
  async function fetchRepo() {
    // Ensure we have valid state and session data
    if (context?.state && session?.accessToken) {
      // Get the repo owner and name from the fully qualified URL
      const repoData = parseRepoSearchInput(context.state.searchInput);
      if (repoData) {
        const [repoOwner, repoName] = repoData;
        fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${session.accessToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            // Destruct and match json with Repo Type
            const {
              id,
              name,
              description,
              html_url: htmlUrl,
              stargazers_count: starCount,
              watchers_count: watchCount,
              forks_count: forkCount,
              owner,
            } = data;
            dispatch({
              type: 'setRepo',
              repo: {
                id,
                name,
                description,
                htmlUrl,
                starCount,
                watchCount,
                forkCount,
              },
              owner: {
                id: owner.id,
                login: owner.login,
                htmlUrl: owner.html_url,
                avatarUrl: owner.avatar_url,
              },
            });
          })
          .catch((error) => {
            // dispatch error for network request error
          });
      } else {
        // dispatch error invalid input
      }
    }
  }

  return { ...context, fetchRepo };
}

export { GithubRepoProvider, useGithubRepo };
