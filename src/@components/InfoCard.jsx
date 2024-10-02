import React from 'react';
import {
  Avatar,
  Chip,
  Divider,
  Grid,
  /* IconButton, */
  Paper,
  Typography,
} from '@mui/material';
import {
  AccessTime,
  BookmarkAdded,
  CheckCircle,
  Email,
  Home,
  /* Facebook,
  Instagram, */
  NoteAlt,
  Person,
  Phone,
  School,
  Work,
} from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { getStatusColor, getStatusTitle } from '@utils/utils';

const stylesPaper = {
  padding: '24px',
  borderRadius: '16px',
  height: '100%',
  width: '100%',
};

/* const stylesIcon = {
  width: '40px',
  height: '40px',
}; */

const styleDivider = {
  borderColor: 'rgb(0 0 0 / 25%)',
  marginTop: '16px',
};

const stylesChip = {
  marginTop: '16px',
  padding: '4px 12px 4px 12px',
  textTransform: 'uppercase',
};

/**
 * @param {string} name: name of the student
 * @param {string} email: email of the student
 * @param {string} status: status of enrollment
 * @param {string} instagram: link to instagram profile
 * @param {string} facebook: link to facebook profile
 * @param {string} location: student's address
 * @param {string} school: student's actual school
 * @param {string} grade: grade the student want to join for
 * @param {string} phone: student's phone number
 * @param {object} styles: { 'styles for the main paper' }
 */
const InfoCard = (props) => {
  const theme = useTheme();
  //TO DO: Colores gris y negro hay que definirlos
  return (
    <Paper sx={{ ...stylesPaper, ...props.styles }}>
      <Grid container spacing={2} sx={{ marginTop: 'auto' }}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: 60,
              height: 60,
            }}
            alt={''}
            src={props.applicant?.photo || ''}
          />
          <Typography
            sx={{ paddingTop: '8px' }}
            variant="h6"
            color="primary"
            children={props.name}
          />
          <Typography variant="body2" color="primary" children={props.email} />
          <Chip
            sx={stylesChip}
            style={{ ...getStatusColor(props.status, theme), color: 'white' }}
            label={getStatusTitle(props.status)}
          />
        </Grid>
        {/* <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <IconButton
            aria-label="instagram"
            color="primary"
            onClick={() => {
              window.open(props.instagram, '_blank');
            }}
          >
            <Instagram sx={stylesIcon} />
          </IconButton>
          <IconButton
            aria-label="facebook"
            color="primary"
            onClick={() => {
              window.open(props.facebook, '_blank');
            }}
          >
            <Facebook sx={stylesIcon} />
          </IconButton>
        </Grid> */}
        <Grid item xs={12}>
          <Divider sx={styleDivider} />
        </Grid>
      </Grid>
      {/* STUDENT INFO DATA */}
      <Grid container sx={{ marginBottom: 'auto' }}>
        <Grid container sx={{ marginTop: '16px' }}>
          <Typography
            variant="h6"
            color="primary"
            children={`Student information`}
          />
        </Grid>
        <Grid container sx={{ marginTop: '8px' }}>
          <Home color="primary" sx={{ marginRight: '8px' }} />
          <Typography
            sx={{ margin: 'auto 4px auto 0px' }}
            variant="body2"
            color="primary"
          >
            Lives at
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
          >
            {props.location ? props.location : 'NO INFO'}
          </Typography>
        </Grid>
        <Grid container sx={{ marginTop: '8px' }}>
          <Email color="primary" sx={{ marginRight: '8px' }} />
          <Typography
            sx={{ margin: 'auto 4px auto 0px' }}
            variant="body2"
            color="primary"
          >
            Email
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
          >
            {props.email}
          </Typography>
        </Grid>
        <Grid container sx={{ marginTop: '8px' }}>
          <Phone color="primary" sx={{ marginRight: '8px' }} />
          <Typography
            sx={{ margin: 'auto 4px auto 0px' }}
            variant="body2"
            color="primary"
          >
            Phone
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
          >
            {props.phone}
          </Typography>
        </Grid>
        <Grid container sx={{ marginTop: '8px' }}>
          <School color="primary" sx={{ marginRight: '8px' }} />
          <Typography
            sx={{ margin: 'auto 4px auto 0px' }}
            variant="body2"
            color="primary"
          >
            Studies at
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
          >
            {props.school ? props.school : 'NO INFO'}
          </Typography>
        </Grid>
        <Grid container sx={{ marginTop: '8px' }}>
          <NoteAlt color="primary" sx={{ marginRight: '8px' }} />
          <Typography
            sx={{ margin: 'auto 4px auto 0px' }}
            variant="body2"
            color="primary"
          >
            Applying to
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
          >
            {props.grade ? props.grade : 'NO INFO'}
          </Typography>
        </Grid>
        {props.is_sister_school && (
          <Grid container sx={{ marginTop: '8px' }}>
            <CheckCircle color="primary" sx={{ marginRight: '8px' }} />
            <Typography
              sx={{ margin: 'auto 4px auto 0px' }}
              variant="body2"
              color="primary"
            >
              Sister school priority
            </Typography>
          </Grid>
        )}
        {props.is_sibling_student && (
          <Grid container sx={{ marginTop: '8px' }}>
            <CheckCircle color="primary" sx={{ marginRight: '8px' }} />
            <Typography
              sx={{ margin: 'auto 4px auto 0px' }}
              variant="body2"
              color="primary"
            >
              Sibling priority
            </Typography>
          </Grid>
        )}
        {props.applicant && props.applicant.guardianName && (
          <Grid item xs={12}>
            <Divider sx={styleDivider} />
          </Grid>
        )}
      </Grid>
      {/* GUARDIAN INFO DATA */}
      {props.applicant && props.applicant.guardianName && (
        <Grid container sx={{ marginBottom: 'auto' }}>
          <Grid container sx={{ marginTop: '16px' }}>
            <Typography
              variant="h6"
              color="primary"
              children={'Guardian information'}
            />
          </Grid>
          <Grid container sx={{ marginTop: '8px' }}>
            <Person color="primary" sx={{ marginRight: '8px' }} />
            <Typography
              sx={{ margin: 'auto 4px auto 0px' }}
              variant="body2"
              color="primary"
            >
              Name
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
            >
              {props.applicant?.guardianName
                ? props.applicant.guardianName
                : 'NO INFO'}
            </Typography>
          </Grid>
          <Grid container sx={{ marginTop: '8px' }}>
            <Home color="primary" sx={{ marginRight: '8px' }} />
            <Typography
              sx={{ margin: 'auto 4px auto 0px' }}
              variant="body2"
              color="primary"
            >
              Lives at
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
            >
              {props.applicant?.guardianAddress
                ? props.applicant.guardianAddress
                : 'NO INFO'}
            </Typography>
          </Grid>
          <Grid container sx={{ marginTop: '8px' }}>
            <Email color="primary" sx={{ marginRight: '8px' }} />
            <Typography
              sx={{ margin: 'auto 4px auto 0px' }}
              variant="body2"
              color="primary"
            >
              Email
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
            >
              {props.applicant?.guardianEmail
                ? props.applicant.guardianEmail
                : 'NO INFO'}
            </Typography>
          </Grid>
          <Grid container sx={{ marginTop: '8px' }}>
            <Phone color="primary" sx={{ marginRight: '8px' }} />
            <Typography
              sx={{ margin: 'auto 4px auto 0px' }}
              variant="body2"
              color="primary"
            >
              Phone
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
            >
              {props.applicant?.guardianPhoneNumber
                ? props.applicant.guardianPhoneNumber
                : 'NO INFO'}
            </Typography>
          </Grid>
          <Grid container sx={{ marginTop: '8px' }}>
            <Work color="primary" sx={{ marginRight: '8px' }} />
            <Typography
              sx={{ margin: 'auto 4px auto 0px' }}
              variant="body2"
              color="primary"
            >
              Occupation
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
            >
              {props.applicant?.guardianOccupation
                ? props.applicant.guardianOccupation
                : 'NO INFO'}
            </Typography>
          </Grid>
          {props.event_preference && (
            <Grid item xs={12}>
              <Divider sx={styleDivider} />
            </Grid>
          )}
        </Grid>
      )}
      {/* EVENT DATA */}
      {props.event_preference && (
        <Grid container sx={{ marginBottom: 'auto' }}>
          <Grid container sx={{ marginTop: '16px' }}>
            <Typography variant="h6" color="primary" children={'Event'} />
          </Grid>
          {props.event_preference && (
            <Grid container sx={{ marginTop: '8px' }}>
              <BookmarkAdded color="primary" sx={{ marginRight: '8px' }} />
              <Typography
                sx={{ margin: 'auto 4px auto 0px' }}
                variant="body2"
                color="primary"
              >
                Event preference
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
              >
                {props.event_preference}
              </Typography>
            </Grid>
          )}
          {props.event_date && (
            <Grid container sx={{ marginTop: '8px' }}>
              <AccessTime color="primary" sx={{ marginRight: '8px' }} />
              <Typography
                sx={{ margin: 'auto 4px auto 0px' }}
                variant="body2"
                color="primary"
              >
                Event date
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 'bold', margin: 'auto 0px' }}
              >
                {props.event_date}
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Paper>
  );
};

export default React.memo(InfoCard);
