import fs from 'node:fs/promises';
import path from 'node:path';

describe('Function "get wallet and repos from gist"', () => {
  let functionBody;
  beforeAll(async () => {
    const location = path.resolve(
      __dirname,
      'get-wallet-and-repos-from-gist.js'
    );
    functionBody = await fs.readFile(location, {
      encoding: 'UTF-8',
    });

    global.Functions = {
      makeHttpRequest: jest.fn(),
      encodeString: jest.fn((input) => input),
    };
  });

  afterAll(() => {
    global.Functions = undefined;
  });

  it('returns the gist owner', async () => {
    Functions.makeHttpRequest.mockImplementationOnce(async () => ({
      data: {
        files: {
          'wallet.txt': {
            content: '0x016720dA88226C8Ff537c9133A2a9361f1FACaE7',
          },
        },
        owner: {
          login: 'mbicknese',
        },
      },
    }));
    const result = await eval(
      `(async (args) => {${functionBody}})(['https://gist.github.com/mbicknese/e07195bc1f833c90eb6356841156189b', '0x016720dA88226C8Ff537c9133A2a9361f1FACaE7'])`
    );
    expect(result).toBe('mbicknese');
  });

  const scenarios = [
    ['notanaddress'],
    ['0x0'],
    ['0x123456789123456789123456789123456789123456789123456789123456789'],
  ];
  it.each(scenarios)('checks for a valid address', async (wallet) => {
    Functions.makeHttpRequest.mockImplementationOnce(async () => ({
      data: {
        files: {
          someFile: {
            content: wallet,
          },
        },
      },
    }));
    await expect(
      eval(
        `(async (args) => {${functionBody}})(['https://gist.github.com/mbicknese/e07195bc1f833c90eb6356841156189b', '${wallet}'])`
      )
    ).rejects.toThrow('Gist does not contain a valid address');
  });

  it('rejects unauthorised claims', async () => {
    Functions.makeHttpRequest.mockImplementationOnce(async () => ({
      data: {
        files: {
          someFile: {
            content: '0x016720dA88226C8Ff537c9133A2a9361f1FACaE7',
          },
        },
      },
    }));
    await expect(
      eval(
        `(async (args) => {${functionBody}})(['https://gist.github.com/mbicknese/e07195bc1f833c90eb6356841156189b', '0xotherwalletaddress'])`
      )
    ).rejects.toThrow('Sender and found address do not match');
  });
});
