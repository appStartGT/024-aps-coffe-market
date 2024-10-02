import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Paper, Grid } from '@mui/material';
import { useAuth, useLocalStorage } from '@hooks';
import FormWrapper from '../components/FormWrapper';
import AccountForm from '../components/AccountForm';
import { setTheme } from '../../../store/theme';
import useLoginForm from '../hooks/useLoginForm';
import useRecoveryPassword from '../hooks/useRecoveryPassword';

const leftGridProps = {
  item: true,
  xs: 12,
  sm: 6,
  md: 7,
  sx: (theme) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }),
};

const rightGridProps = {
  item: true,
  xs: 12,
  sm: 6,
  md: 5,
  component: Paper,
  elevation: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  sx: (theme) => ({
    padding: '18px',
    [theme.breakpoints.down('md')]: {
      order: 1,
    },
  }),
};

const SignInSide = () => {
  const auth = useAuth();
  const localStorage = useLocalStorage();
  const dispatch = useDispatch();
  const {
    formik: formikLogin,
    handleLogin,
    loading: loadingLogin,
  } = useLoginForm();
  const {
    formik: formikRecoveryPass,
    handleRecovery,
    loading: loadingRecoveryPass,
  } = useRecoveryPassword();

  const [showLoginForm, setShowLoginForm] = useState(true);

  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      dispatch(setTheme(localTheme));
    }
  }, []);

  return (
    <Grid
      container
      component="main"
      sx={{
        height: '100vh',
        // backgroundImage: 'url(/img/svg/bebe.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? '#CED2DE' : '#CED2DE',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Grid {...leftGridProps}>
        <img
          style={{ width: '100%', maxWidth: '800px' }}
          src="/img/png/authlogin.png"
        />
      </Grid>
      <Grid {...rightGridProps}>
        <FormWrapper
          sxTittle={{
            textAlign: 'center',
          }}
          sxWrapper={{
            justifyContent: 'center',
          }}
          title={(() => {
            return showLoginForm ? 'Iniciar sesion' : 'Find your email';
          })()}
        >
          {showLoginForm ? (
            <AccountForm
              submitText={'Login'}
              handleClick={handleLogin}
              formik={formikLogin}
              loading={loadingLogin}
            />
          ) : (
            <AccountForm
              alertProps={{
                text:
                  auth?.resetPassowordInfo?.message ||
                  'Please enter your email address to continue.',
                severity: auth?.resetPassowordInfo?.severity || 'info',
              }}
              submitText={'Reset'}
              label={'Log in with your account.'}
              labelClick={() => {
                setShowLoginForm(true);
              }}
              handleClick={handleRecovery}
              formik={formikRecoveryPass}
              loading={loadingRecoveryPass}
            />
          )}
        </FormWrapper>
      </Grid>
    </Grid>
  );
};

export default SignInSide;
