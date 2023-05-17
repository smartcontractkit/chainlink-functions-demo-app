import fs from 'node:fs/promises';
import path from 'node:path';

describe('Function "github metric times ether"', () => {
  let functionBody;
  beforeAll(async () => {
    const location = path.resolve(__dirname, 'github-metric-times-ether.js');
    functionBody = await fs.readFile(location, {
      encoding: 'UTF-8',
    });

    global.Functions = {
      makeHttpRequest: jest.fn(),
      encodeUint256: jest.fn((input) => input),
    };
  });

  afterAll(() => {
    global.Functions = undefined;
  });

  const url =
    'https://github.com/smartcontractkit/functions-hardhat-starter-kit';
  const scenarios = [
    [10, 1, url, 'forks', '5', '1000000', 2_000_000],
    [1, 10, url, 'stars', '5', '1000000', 2_000_000],
    [1, 0, url, 'forks', '5', '1000000', 0],
    [0, 1, url, 'stars', '5', '1000000', 0],
    [26, 1, url, 'forks', '3', '1200000', 9_600_000],
  ];
  it.each(scenarios)(
    'calculates the right amount',
    async (forks, stars, url, metric, target, amount, expected) => {
      Functions.makeHttpRequest.mockImplementationOnce(async () => ({
        data: {
          forks_count: forks,
          stargazers_count: stars,
        },
      }));
      const result = await eval(
        `(async (args) => {${functionBody}})([url, metric, target, amount])`
      );
      expect(result).toBe(expected);
    }
  );
});
