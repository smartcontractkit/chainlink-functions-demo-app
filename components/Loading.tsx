import { type FC } from 'react';

const dot = `rounded-full h-2 w-2 mx-0.5 bg-current animate-[blink_1s_ease_0s_infinite_normal_both]"`;
const style = { animationDelay: '0.2s' };

export const Loading: FC = () => {
  return (
    <span className="inline-flex text-center items-center leading-7 h-6">
      <span className={dot} key="dot_1" />
      <span className={dot} style={style} key="dot_2" />
      <span className={dot} style={style} key="dot_3" />
    </span>
  );
};
