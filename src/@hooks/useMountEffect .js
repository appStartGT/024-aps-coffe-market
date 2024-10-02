import { useEffect, useRef } from 'react';

/**
 * Run callback once when the component is mounted
 * @param {*} effect callback
 * @param {*} deps array of dependencies
 * @param {*} unMount runs when the component is unmounted
 */
const useMountEffect = ({ effect, deps = [], unMount }) => {
  if (import.meta.env.PROD) {
    //validate production mode
    useEffect(() => {
      (async () => await effect())();

      return () => {
        unMount && unMount();
      };
    }, deps);

    return;
  }

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (!isInitialMount.current) {
      (async () => await effect())();

      return () => {
        unMount && unMount();
      };
    } else {
      isInitialMount.current = false;
    }
  }, deps);
};

export default useMountEffect;
