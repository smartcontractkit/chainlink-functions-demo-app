import { RefObject, useEffect } from 'react';

/**
 * Element focus uses Control + keyboard input to trigger
 * @param key numerical value of key input
 * @param ref ref to element to targe focus on
 */
export default function useKeyFocus(
  key: number,
  ref: RefObject<HTMLInputElement>
) {
  useEffect(() => {
    function hotkeyPress(e: KeyboardEvent) {
      if (e.ctrlKey && e.keyCode === key && ref?.current) {
        e.preventDefault();
        if (ref?.current) {
          ref.current.focus();
        }
        return;
      }
    }

    document.addEventListener('keydown', hotkeyPress);
    return () => document.removeEventListener('keydown', hotkeyPress);
  }, [key, ref]);
}
