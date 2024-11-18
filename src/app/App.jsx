import { Suspense, useEffect } from 'react';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import { AbilityProvider } from './context/AbilityContext';
import CustomTheme from '@components/theme/CustomTheme';
import { LoadingPage } from '@components/routerComponents/Navigation';

/* Context */
import { AuthProvider } from '../app/context/FirebaseAuthContext';
import { useRouter } from '@hooks';
import { Toaster } from 'react-hot-toast';
import ApsGlobalModal from '@components/ApsGlobalModal';
import { catRubroCatalogAction } from './store/modules/catalogs';
import { getBudgetAction } from './store/modules/budget';
import { useDispatch } from 'react-redux';

const App = () => {
  const { mainNavigation } = useRouter();
  const navigation = useRoutes(mainNavigation);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(catRubroCatalogAction());
    dispatch(getBudgetAction());
  }, [dispatch]);

  return (
    <AbilityProvider>
      <Toaster />
      <AuthProvider>
        <CustomTheme>
          <ApsGlobalModal />
          {navigation}
        </CustomTheme>
      </AuthProvider>
    </AbilityProvider>
  );
};

const AppWithRouter = () => (
  <Suspense fallback={<LoadingPage />}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Suspense>
);

export default AppWithRouter;
