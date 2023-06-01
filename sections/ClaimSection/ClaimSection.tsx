import { ethers } from 'ethers';
import { useState } from 'react';

import CFInput from '@components/CFInput';
import CFButton from '@components/CFButton';
import CFContractNotification from '@components/CFContractNotification';

import LedgerABI from '../../build/artifacts/contracts/Ledger.sol/Ledger.json';
import ContractProgress from '../ContractProgress';
import { Ledger } from '../../typechain-types';

import { content, steps } from './data';
import styles from './ClaimSection.module.css';

const ClaimSection = () => {
  const [gist, setGist] = useState<string>('');
  const [state, setState] = useState<
    'uninitialized' | 'initialized' | 'pending' | 'success' | 'fail'
  >('uninitialized');
  type Progress = (typeof steps)[number]['count'];
  const [progress, setProgress] = useState<Progress>(1);

  const handleClaim = () => {
    setState('initialized');
    setProgress(1);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ledger = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
      LedgerABI.abi,
      signer
    );

    (async () => {
      try {
        /**
         * All we need to do is call the claim function on our contract. It will verify the identity using Chainlink
         * Functions, followed by paying out all relevant donations on the chain.
         */
        const receipt = await (
          await (ledger as Ledger).claim(
            gist,
            process.env.NEXT_PUBLIC_SUBSCRIPTION_ID || '',
            { gasLimit: 600_000 }
          )
        ).wait(1);

        const requestId = receipt.events?.[0].topics[1];

        /**
         * Multiple calculations may be running at the same time. We're going to poll for new events and wait for
         * one that matches our request id. There's a safeguard that stop the execution after 60 seconds.
         */
        let result: { args: [string, string, string] } | undefined;
        const started = Date.now();
        while (!result && Date.now() - started < 60_000) {
          const events = await ledger.queryFilter(ledger.filters.OCRResponse()); // Only get the relevant events
          result = events.find((event) => event.args?.[0] === requestId) as
            | { args: [string, string, string] }
            | undefined;
        }
        // Bail out if the event didn't fire or the event contains an error response from Chainlink Functions
        if (result == null || result.args[2] !== '0x') {
          setState('uninitialized');
          throw new Error(
            'Chainlink function did not finish successfully.' +
              ethers.BigNumber.from(result?.args[2]).toHexString()
          );
        }

        setState('success');
      } catch (e) {
        console.log(e);
        setState('fail');
      }
    })();
  };

  return (
    <article className={styles.container}>
      <main>
        {state === 'success' || state === 'fail' ? (
          <CFContractNotification
            status={state}
            onClear={() => {
              setState('uninitialized');
            }}
            content={content}
          />
        ) : state === 'uninitialized' ? (
          <form className={styles.inputs}>
            <p className={styles.info_description}>
              Enter the URL to your gist containing your wallet address here.
            </p>
            <CFInput
              iconType="link"
              type="url"
              onInput={setGist}
              placeholder="Your gist"
            />
            <CFButton
              onClick={handleClaim}
              text="Claim your funds"
              disabled={gist === ''}
            />
          </form>
        ) : (
          <ContractProgress
            progress={progress}
            steps={steps}
            heading="Your claim is being verified"
          />
        )}
      </main>
      <aside>
        <h2 className={styles.info_heading}>
          Open source maintainer? Claim your donations!
        </h2>
        <p className={styles.info_description}>
          There might be funds waiting for you! Create a gist containing your
          wallet address and paste the link to that file here. We&apos;ll check
          if there have been donations to your repositories and transfer the ETH
          to your wallet.
            <br />
            <br />
            <a className={styles.info_link} href="https://functions.chain.link/">Add your wallet address to the Functions beta preview list to use this app.</a>
        </p>
      </aside>
    </article>
  );
};

export default ClaimSection;
