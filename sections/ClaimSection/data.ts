import { IStep } from '../ContractProgress';

export const steps = [
  {
    count: 1,
    label: 'Looking for donations',
    tip: 'Using Chainlink Functions authenticate your identity and find relevant donations',
  },
] as const satisfies readonly IStep[];

export const content = {
  fail: {
    message: 'Sorry, something went wrong, please try again',
    btnText: 'Try again',
  },
  success: {
    message: 'All donations have been transferred to your wallet',
    btnText: 'Claim another',
  },
};
