type InjectedProviders = {
  isMetaMask?: true;
};

interface Window {
  ethereum: InjectedProviders & {
    on: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    request<T = any>(args: any): Promise<T>;
  };
}

type User = {
  email: string;
  imageUrl?: string;
};
