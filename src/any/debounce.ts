/**
 * Ensures a function only runs once it has stopped being called for a certain amount of time.
 * Useful for: resize events, scroll events, etc.
 * @param fn 
 * @param delay
 */
export const debounce = (fn: () => void, delay = 250) => {
    let debounceTimeOut: NodeJS.Timeout | null = null;
    return () => {
      clearTimeout(debounceTimeOut as NodeJS.Timeout);
      debounceTimeOut = setTimeout(() => {
        fn();
      }, delay);
    };
  };