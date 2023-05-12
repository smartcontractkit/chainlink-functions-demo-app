import React, { type PropsWithChildren } from 'react';

type ConnectAction = { type: 'connect'; wallet: string; balance: string };
type DisconnectAction = { type: 'disconnect' };
type PageLoadedAction = {
  type: 'pageLoaded';
  isMetaMaskInstalled: boolean;
  wallet: string | null;
  balance: string | null;
};
type LoadingAction = { type: 'loading' };
type IdleAction = { type: 'idle' };

type Action =
  | ConnectAction
  | DisconnectAction
  | PageLoadedAction
  | LoadingAction
  | IdleAction;

type Dispatch = (action: Action) => void;

type Status = 'loading' | 'idle' | 'pageNotLoaded';

type State = {
  wallet: string | null;
  isMetaMaskInstalled: boolean;
  status: Status;
  balance: string | null;
};

const initialState: State = {
  wallet: null,
  isMetaMaskInstalled: false,
  status: 'loading',
  balance: null,
} as const;

function metaMaskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'connect': {
      const { wallet, balance } = action;
      const newState = { ...state, wallet, balance, status: 'idle' } as State;
      const info = JSON.stringify(newState);
      window.localStorage.setItem('MetaMaskState', info);
      return newState;
    }
    case 'disconnect': {
      window.localStorage.removeItem('MetaMaskState');
      return { ...state, wallet: null, balance: null };
    }
    case 'pageLoaded': {
      const { isMetaMaskInstalled, balance, wallet } = action;
      return {
        ...state,
        isMetaMaskInstalled: isMetaMaskInstalled,
        status: 'idle',
        wallet,
        balance,
      };
    }
    case 'loading': {
      return { ...state, status: 'loading' };
    }
    case 'idle': {
      return { ...state, status: 'idle' };
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
}

const MetaMaskContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function MetaMaskProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = React.useReducer(metaMaskReducer, initialState);
  const value = { state, dispatch };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
}

function useMetaMask() {
  const context = React.useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
}

export { MetaMaskProvider, useMetaMask };
