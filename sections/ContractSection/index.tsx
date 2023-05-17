import { useState } from 'react';
import { ethers } from 'ethers';

import CFIconLabel from '@components/CFIconLabel';
import CFInput from '@components/CFInput';
import CFDropDown from '@components/CFDropDown';
import CFButton from '@components/CFButton';
import CFContractNotification from '@components/CFContractNotification';
import ContractProgress from 'sections/ContractProgress';

import LedgerABI from '../../build/artifacts/contracts/Ledger.sol/Ledger.json';
import { useMetaMask } from '../../hooks/useMetaMask';

import styles from './ContractSection.module.css';
import { breakdown, content, contractOptions, steps } from './data';

const ContractSection = () => {
  const [calculatedAmount, setCalculatedAmount] = useState('');
  const { state: metaMaskState } = useMetaMask();
  const [matic, setMatic] = useState(0);
  const [stars, setStars] = useState(0);
  type Progress = (typeof steps)[number]['count'];
  const [progress, setProgress] = useState<Progress>(1);
  const [repo, setRepo] = useState<string | undefined>(undefined);
  const [state, setState] = useState<
    'uninitialized' | 'initialized' | 'pending' | 'success' | 'fail'
  >('uninitialized');

  function handleDonation() {
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
        // Step 1: Have Chainlink Functions calculate the amount of Ether to donate
        const calculationTx = await ledger.multiplyMetricWithEther(
          `https://github.com/${repo}`,
          'stars',
          `${stars}`,
          ethers.utils.parseUnits(matic.toString(), 'ether').toString(),
          process.env.NEXT_PUBLIC_SUBSCRIPTION_ID,
          {
            gasLimit: 600_000,
          }
        );
        const calculationReceiptTx = await calculationTx.wait(1);
        // Chainlink Functions give you a request id to track to progress of your execution
        const requestId = calculationReceiptTx.events[0].topics[1];

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

        // Step 2: Donate the calculated amount to the ledger
        setProgress(2);
        const calculatedAmountHex = result.args[1];
        const calculatedAmount = parseInt(calculatedAmountHex, 16);
        setCalculatedAmount(
          (calculatedAmount / 1_000_000_000_000_000_000).toString()
        );

        await (
          await ledger.donate(`https://github.com/${repo}`, {
            value: calculatedAmountHex,
          })
        ).wait(1);
        setState('success');
      } catch (e) {
        console.log(e);
        setState('fail');
      }
    })();
  }

  return (
    <section className={styles.container}>
      <div className={styles.content_wrapper}>
        <div>
          <h1 className={styles.info_heading}>
            Sponsor your favorite GitHub creators with Chainlink Functions
          </h1>
          <p className={styles.info_description}>
            Contribute to GitHub creators who meet the goals you define.
            <br />
            <br />
            Define a threshold goal for the creator to reach and execute a
            one-time donation based on your criteria.
          </p>
          <div className={styles.info_breakdown}>
            {breakdown.map(({ icon, text }, breakdownIndex) => (
              <CFIconLabel icon={icon} text={text} key={breakdownIndex} />
            ))}
          </div>
        </div>

        <div className={styles.inputs}>
          {state === 'success' || state === 'fail' ? (
            <CFContractNotification
              status={state}
              onClear={() => {
                setState('uninitialized');
              }}
              content={content}
            />
          ) : (
            <>
              {state === 'initialized' ? (
                <ContractProgress
                  progress={progress}
                  textData={{ amount: calculatedAmount }}
                  steps={steps}
                  heading="Your payment is being processed"
                />
              ) : (
                <>
                  <div>
                    <CFInput
                      type="url"
                      iconType="link"
                      placeholder="Enter GitHub repo URL"
                      base={`https://github.com/${repo || ''}`}
                      onInput={(value) => setRepo(value.slice(19))}
                    />
                  </div>
                  <div className={styles.option_count}>
                    <CFDropDown
                      options={contractOptions}
                      defaultValue={contractOptions[0]}
                    />
                    <CFInput
                      type="text"
                      placeholder="Enter number of stars"
                      onInput={(value) => setStars(+value)}
                    />
                  </div>
                  <div>
                    <CFInput
                      type="text"
                      iconType="matic"
                      placeholder="Enter Matic amount contribution (ex: 0.0001)"
                      onInput={(value) => setMatic(+value)}
                    />
                  </div>
                  <div className={styles.btn_wrapper}>
                    <CFButton
                      text="Execute contract"
                      size="lg"
                      onClick={handleDonation}
                      disabled={
                        !(
                          matic > 0 &&
                          stars > 0 &&
                          repo &&
                          state === 'uninitialized' &&
                          metaMaskState.wallet
                        )
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContractSection;
