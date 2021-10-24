import { useCallback, useEffect } from "react";
/**
 * @param { (...args: any[]) => any } fn - A callback function to use debounce effect on.
 * @param { number } delay - A number that indicates how much time it waits.
 * @param { any[] } deps - A dependency list.
 *
 */
export const useDebounce = (
  fn: (...args: any[]) => any,
  delay: number,
  deps: any[]
) => {
  const callback = useCallback(fn, deps);

  useEffect(() => {
    // Call the memoized version of callback after the delay
    const handler = setTimeout(() => {
      callback();
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [callback]);
};
