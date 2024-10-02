import { Save as SaveIcon } from '@mui/icons-material';
import { Paper } from '@mui/material';
import ApsModal from '@components/ApsModal';
import ApsForm from '@components/ApsForm';
import CardInfo from './CardInfo';

const ChangePasswordSection = ({
  stylesPapers,
  setCurrentModal,
  handleChangePassword,
  onClose,
  currentModal,
  formik,
  processing,
}) => {
  return (
    <Paper sx={{ margin: '0px -24px', ...stylesPapers }}>
      <ApsModal
        open={currentModal == 'changePassword'}
        onClose={onClose}
        maxWidth="xs"
        title={'Change your password'}
        description={'Complete the fields.'}
        content={
          <ApsForm formik={formik} handleSubmit={handleChangePassword} />
        }
        handleOk={handleChangePassword}
        titleOk="Guardar"
        handleCancel={onClose}
        titleCancel="Cancelar"
        okProps={{
          endIcon: <SaveIcon />,
          disabled: !formik.form.isValid || processing,
        }}
      />

      <CardInfo
        title={'Change Password'}
        subTitle={'You can change your password here'}
        onClick={() => setCurrentModal('changePassword')}
      />
    </Paper>
  );
};

export default ChangePasswordSection;
