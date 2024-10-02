// ** React Imports
import { useEffect } from 'react';
// ** Hooks Import
import { useAuth, useSessionStorage, useRouter } from '@hooks';

const AuthGuard = ({ children, fallback/* , ...props  */}) => {
  const auth = useAuth();
  const router = useRouter();
  const sessionStorage = useSessionStorage();

  useEffect(
    () => {
      //   if (auth.user === null && !sessionStorage.getItem('userData')) {
      if (auth.user === null && !sessionStorage.storedValue) {
        if (router.currentPath() !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath },
          });
        } else {
          router.replace('/login');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  );

  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
