import { IStep } from '../ContractProgress';

export const breakdown = [
  {
    icon: 'add-user',
    text: 'Support GitHub creators',
  },
  {
    icon: 'star',
    text: 'Donate Matic based on repo popularity',
  },
  {
    icon: 'shield',
    text: 'Your GitHub is completely safe',
  },
];

export const contractOptions = [{ name: 'Stars' }];

export const steps = [
  {
    count: 1,
    label: 'Calculating MATIC',
    tip: 'Using Chainlink Functions to calculate the total amount of MATIC pledged.',
  },
  {
    count: 2,
    label: 'Pledging donation',
    tip: 'Chainlink Functions has determined a donation of {AMOUNT} MATIC.',
  },
] as const satisfies readonly IStep[];

export const content = {
  success: {
    message: 'Your contract has been successfully created',
    btnText: 'Execute another contract',
  },
  fail: {
    message: 'Sorry, something went wrong, please try again',
    btnText: 'Try again',
  },
};
