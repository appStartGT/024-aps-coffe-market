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
  xs: false,
  sm: false,
  md: 6,
  sx: (theme) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  }),
};

const rightGridProps = {
  item: true,
  xs: 12,
  sm: 12,
  md: 6,
  component: Paper,
  elevation: 0,
  sx: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '18px',
    background: 'Transparent',
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
        backgroundImage: 'url(/img/jpg/background.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? '#CED2DE' : '#CED2DE',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Grid {...rightGridProps}></Grid>
      <Grid {...leftGridProps}>
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
              submitText={'Ingresar'}
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
        {/* <img
          style={{
            alignSelf: 'flex-end',
            marginBottom: '32px',
            marginRight: '30px',
            width: '100%',
            maxWidth: '600px',
          }}
          src="/img/svg/MediProLogoSVG.svg"
        /> */}
      </Grid>
    </Grid>
  );
};

export default SignInSide;
