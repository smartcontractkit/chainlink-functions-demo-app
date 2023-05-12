import React, { PropsWithChildren, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useMetaMask } from './useMetaMask';

const ClaimContext = React.createContext<
  | { isClaiming: boolean; claim: () => void; amount: number | undefined }
  | undefined
>(undefined);

function ClaimProvider({ children }: PropsWithChildren) {
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useMetaMask();
  let isClaiming = false;

  const claim = () => {
    if (
      searchParams.get('claim') === 'continue' &&
      state.wallet != null &&
      !isClaiming &&
      !hasClaimed
    ) {
      isClaiming = true;
      setHasClaimed(true);
      (async () => {
        const res = await fetch('/api/claim', {
          method: 'POST',
          body: JSON.stringify({ wallet: state.wallet }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setAmount(
          parseInt((await res.json()).value, 16) / 1_000_000_000_000_000_000
        );

        const params = new URLSearchParams(searchParams);
        params.delete('claim');
        await router.replace(
          [pathname, ...(params.toString() ? [params.toString()] : [])].join(
            '?'
          )
        );
      })();
    }
  };

  return (
    <ClaimContext.Provider value={{ isClaiming: hasClaimed, claim, amount }}>
      {children}
    </ClaimContext.Provider>
  );
}

function useClaim() {
  const context = React.useContext(ClaimContext);
  if (context === undefined) {
    throw new Error('useClaim must be used within a ClaimProvider');
  }
  return context;
}

export { ClaimProvider, useClaim };
