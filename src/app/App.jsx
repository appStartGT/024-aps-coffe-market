import { Suspense } from 'react';
import { useRoutes, BrowserRouter } from 'react-router-dom';
import { AbilityProvider } from './context/AbilityContext';
import CustomTheme from '@components/theme/CustomTheme';
import { LoadingPage } from '@components/routerComponents/Navigation';

/* Context */
import { AuthProvider } from '../app/context/FirebaseAuthContext';
import { useRouter } from '@hooks';
import { Toaster } from 'react-hot-toast';
import ApsGlobalModal from '@components/ApsGlobalModal';
import { BudgetListenerProvider } from './context/BudgetListenerContext';
import ApsNewOptionModal from '@components/ApsNewOptionModal';

const App = () => {
  const { mainNavigation } = useRouter();
  const navigation = useRoutes(mainNavigation);

  return (
    <AbilityProvider>
      <Toaster />
      <AuthProvider>
        <BudgetListenerProvider>
          <CustomTheme>
            <ApsGlobalModal />
            <ApsNewOptionModal />
            {navigation}
          </CustomTheme>
        </BudgetListenerProvider>
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
