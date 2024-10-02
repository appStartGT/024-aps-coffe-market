import GeneralContainer from '@components/generalContainer/GeneralContainer';
import ChangePasswordSection from '../components/ChangePasswordSection';
import PersonalDetailsSection from '../components/PersonalDetailsSection';
import { Box } from '@mui/material';
import usePersonalDetails from '../hooks/usePersonalDetails';
import useChangePassword from '../hooks/useChangePassword';

const stylesPapers = {
  padding: '24px',
  borderRadius: '12px',
};

const SettingsPage = () => {
  const {
    handleOnclick,
    onClose,
    setCurrentModal,
    formik,
    currentModal,
    selectedUser,
    processing,
    loading,
  } = usePersonalDetails();

  const {
    setCurrentModal: setCurrentModalPassword,
    handleChangePassword,
    onClose: onClosePassword,
    currentModal: currentModalPassword,
    formik: formikPassword,
    processing: processingPassword,
  } = useChangePassword();

  return (
    <GeneralContainer
      title="Account settings"
      subtitle="Application settings module"
      actions={[]}
      skeletonHeader={loading}
      skeletonBody={loading}
      buttonProps={{}}
      container={
        <Box padding={'16px'}>
          <PersonalDetailsSection
            stylesPapers={stylesPapers}
            handleOnclick={handleOnclick}
            onClose={onClose}
            setCurrentModal={setCurrentModal}
            formik={formik}
            currentModal={currentModal}
            selectedUser={selectedUser}
            processing={processing}
          />
          <ChangePasswordSection
            stylesPapers={stylesPapers}
            setCurrentModal={setCurrentModalPassword}
            handleChangePassword={handleChangePassword}
            onClose={onClosePassword}
            currentModal={currentModalPassword}
            formik={formikPassword}
            processing={processingPassword}
          />
        </Box>
      }
    />
  );
};

export default SettingsPage;
