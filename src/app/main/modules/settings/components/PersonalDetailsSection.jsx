import { Grid, Paper, Typography } from '@mui/material';
import CardInfo from './CardInfo';
import { Save as SaveIcon } from '@mui/icons-material';
import ApsModal from '@components/ApsModal';
import ApsForm from '@components/ApsForm';
import ApsInfoAlert from '@components/ApsInfoAlert';

const PersonalDetailsSection = ({
  stylesPapers,
  handleOnclick,
  onClose,
  setCurrentModal,
  formik,
  currentModal,
  selectedUser,
  processing,
}) => {
  return (
    <Paper sx={{ margin: '0px -24px 24px -24px', ...stylesPapers }}>
      <ApsModal
        open={currentModal == 'personalDetails'}
        onClose={onClose}
        maxWidth="sm"
        title={'Personal details'}
        description={'Complete the fields.'}
        content={<ApsForm formik={formik} handleSubmit={handleOnclick} />}
        handleOk={handleOnclick}
        titleOk="Guardar"
        handleCancel={onClose}
        titleCancel="Cancelar"
        okProps={{
          endIcon: <SaveIcon />,
          disabled: !formik.form.isValid || processing,
        }}
      />
      <ApsInfoAlert text="Data will be updated upon next login." />
      <Grid container direction={'column'} rowGap={'16px'}>
        <CardInfo
          title={'Personal Details'}
          subTitle={'Manage information related to your personal details'}
          onClick={() => setCurrentModal('personalDetails')}
        />

        <Grid container direction={'row'}>
          <Grid
            item
            xs={2}
            sx={{
              textAlign: 'right',
              marginRight: '8px',
              color: 'grey',
            }}
          >
            <Typography sx={{ marginBottom: '8px' }}>Name:</Typography>
            <Typography sx={{ marginBottom: '8px' }}>Email:</Typography>
            <Typography sx={{ marginBottom: '8px' }}>Phone:</Typography>
            <Typography sx={{ marginBottom: '8px' }}>Photo:</Typography>
          </Grid>
          <Grid item xs={9} sx={{ textAlign: 'left', marginLeft: '8px' }}>
            <Typography sx={{ marginBottom: '8px' }}>
              {selectedUser?.name}
            </Typography>

            <Typography sx={{ marginBottom: '8px' }}>
              {selectedUser?.email}
            </Typography>
            <Typography sx={{ marginBottom: '8px' }}>
              {selectedUser?.telephone}
            </Typography>
            {/* <Typography sx={{ marginBottom: '8px' }}> */}
            <img width={'150px'} src={selectedUser?.photo} />
            {/* </Typography> */}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PersonalDetailsSection;
