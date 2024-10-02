import { Grid } from '@mui/material';
import FormWrapper from '../components/FormWrapper';
import useResetPassword from '../hooks/useResetPassword';
import AccountForm from '../components/AccountForm';

const leftGridProps = {
  item: true,
  xs: false,
  sm: false,
  md: 6,
  sx: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const rightGridProps = {
  item: true,
  xs: false,
  sm: false,
  md: 6,
  sx: (theme) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  }),
};

const RenewPassword = () => {
  const { formik, handleResetPassword, loading } = useResetPassword();

  return (
    <Grid
      container
      component="main"
      sx={{
        height: '100vh',
        backgroundImage: 'url(/img/png/authlogin.png)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Grid {...leftGridProps}>
        {/* <img width="100%" src="/img/LogoNrollio.png" /> */}
        <FormWrapper
          title={'Restablecer contraseña'}
          sxTittle={{ textAlign: 'center' }}
        >
          <AccountForm
            submitText={'Restablecer'}
            handleClick={handleResetPassword}
            formik={formik}
            loading={loading}
          />
        </FormWrapper>
      </Grid>
      <Grid {...rightGridProps}>
        <img width="600px" src="/img/png/authlogin.png" />
      </Grid>
    </Grid>
  );
};

export default RenewPassword;
