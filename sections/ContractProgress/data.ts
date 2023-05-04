interface IStep {
  count: number;
  label: string;
  tip: string;
}
export const steps: IStep[] = [
  {
    count: 1,
    label: 'Subscribing',
    tip: 'Subscribing to Chainlink Functions.',
  },
  {
    count: 2,
    label: 'Funding subscription',
    tip: 'Chainlink Functions requires 1 LINK to be executed.',
  },
  {
    count: 3,
    label: 'Linking subscription',
    tip: 'Using the funded subscription to use the smart contract.',
  },
  {
    count: 4,
    label: 'Calculating MATIC',
    tip: 'Using Chainlink Functions to calculate to total amount of MATIC pledged.',
  },
  {
    count: 5,
    label: 'Pledging donation',
    tip: 'Chainlink Functions has determined a donation of {AMOUNT} MATIC.',
  },
];
