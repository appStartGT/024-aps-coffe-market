import { useEffect } from 'react';

function useDebounce(callBack, delay, deps = []) {
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        callBack && typeof callBack == 'function' && callBack();
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed
      // within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [...deps, delay] // Only re-call effect if deps or delay changes
  );
}

export default useDebounce;
