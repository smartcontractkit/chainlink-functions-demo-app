import CFIconLabel from '@components/CFIconLabel';
import styles from './ContractSection.module.css';
import { breakdown, contractOptions } from './data';
import CFInput from '@components/CFInput';
import CFDropDown from '@components/CFDropDown';
import CFButton from '@components/CFButton';

const ContractSection = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content_wrapper}>
        <div>
          <h1 className={styles.info_heading}>
            Spin up your Github account with a Chainlink
          </h1>
          <p className={styles.info_description}>
            Participating in open source projects on GitHub can help you gain
            visibility and recognition in the developer community.
          </p>
          <div className={styles.info_breakdown}>
            {breakdown.map(({ icon, text }, breakdownIndex) => (
              <CFIconLabel icon={icon} text={text} key={breakdownIndex} />
            ))}
          </div>
        </div>

        <div className={styles.inputs}>
          <div>
            <CFInput
              type="url"
              iconType="link"
              placeholder="Enter Github repo URL"
              onInput={() => null}
            />
          </div>
          <div className={styles.option_count}>
            <CFDropDown
              options={contractOptions}
              defaultValue={contractOptions[0]}
            />
            <CFInput
              type="text"
              placeholder="Enter number"
              onInput={() => null}
            />
          </div>
          <div>
            <CFInput
              type="text"
              iconType="matic"
              placeholder="Enter number of MATIC"
              onInput={() => null}
            />
          </div>
          <div className={styles.btn_wrapper}>
            <CFButton
              text="Execute contract"
              size="lg"
              onClick={() => null}
              disabled={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractSection;
