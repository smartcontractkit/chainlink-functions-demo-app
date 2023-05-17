import cn from 'classnames';
import CFNumberIndicator from '@components/CFNumberIndicator';
import styles from './ContractProgress.module.css';

export interface IStep {
  count: number;
  label: string;
  tip: string;
}
interface IContractProgress {
  progress: number;
  textData?: Record<string, string>;
  steps: readonly IStep[];
  heading: string;
}

const indicator_status = {
  done: 'done',
  in_progress: 'in progress',
  pending: 'pending',
} as const;

const ContractProgress = ({
  progress,
  textData = {},
  steps,
  heading,
}: IContractProgress) => {
  const getStatus = (value: number) => {
    return progress === value
      ? indicator_status.in_progress
      : value > progress
      ? indicator_status.pending
      : indicator_status.done;
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>{heading}</h3>
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
            {step.count !== steps.at(-1)?.count && (
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
        {Object.keys(textData).reduce(
          (result, key) =>
            result.replace(`{${key.toUpperCase()}}`, textData[key]),
          steps[progress - 1]?.tip
        )}
      </div>
    </div>
  );
};

export default ContractProgress;
