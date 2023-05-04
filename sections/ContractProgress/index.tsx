import cn from 'classnames';
import CFNumberIndicator from '@components/CFNumberIndicator';
import styles from './ContractProgress.module.css';
import { steps } from './data';
import { indicator_status } from 'data/indicator-data';

export type IProgress = 1 | 2 | 3 | 4 | 5 | 6;
interface IContractProgress {
  progress: IProgress;
  amount: string;
}

const ContractProgress = ({ progress, amount }: IContractProgress) => {
  const getStatus = (value: number) => {
    return progress === value
      ? indicator_status.in_progress
      : value > progress
      ? indicator_status.pending
      : indicator_status.done;
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>Your payment is being processed</h3>
      <div className={styles.steps}>
        {steps.map((step) => (
          <div className={styles.step} key={step.count}>
            <CFNumberIndicator
              count={step.count}
              status={getStatus(step.count)}
            />
            <span
              className={cn(styles.step_label, {
                [styles.active_label]:
                  getStatus(step.count) === indicator_status.in_progress,
              })}
            >
              {step.label}
            </span>
            {step.count !== 5 && (
              <div className={cn(styles.separator)}>
                <div
                  className={cn(styles.active_separator, {
                    [styles.active_separator_done]:
                      getStatus(step.count) === indicator_status.done,
                  })}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.progress_tip}>
        {steps[progress - 1]?.tip.replace('{AMOUNT}', amount)}
      </div>
    </div>
  );
};

export default ContractProgress;
