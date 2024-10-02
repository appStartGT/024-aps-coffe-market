import {
  CheckCircle,
  Delete,
  Download,
  PictureAsPdf,
} from '@mui/icons-material';
import {
  Avatar,
  Grid,
  IconButton,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import React from 'react';
import ApsFileDownloadLink from './ApsFileDownloadLink';

const stylesListItem = {
  marginBottom: '10px',
};

const stylesButton = {
  width: '100%',
  textAlign: 'left',
};

const stylesGreenCheck = {
  marginLeft: 'auto',
  marginRight: '8px',
  marginTop: 'auto',
};

/**
 * @param {boolean} isDivided: true if items will be divided, false if not
 * @param {object} styles: styles to be applied to the whole list
 * @param {array of objects} listItems: list of items to be rendered
 *    - {string} title:
 *    - {string} description:
 *    - {object} styles: styles to be applied to the item
 *    - {string} type: pdf / button
 *    - {function} onClick: IF type is button - function to execute when clicking item
 *    - {array of objects} buttons: IF type is pdf - renders array of buttons on the right
 *      - {string} icon: download / delete
 *      - {object} styles: styles to be applied to the icon
 *      - {function} onClick: function to be executed when clicking the button
 */
const StyledList = (props) => {
  const sizeInMB = (size) => (size / 1000000).toFixed(2);
  return (
    <Grid container flexDirection={'column'} sx={{ ...props.styles }}>
      {(props.listItems &&
        props.listItems.length &&
        props.listItems.map((listItem, index) => (
          <Grid item key={index} sx={{ ...stylesListItem, ...listItem.styles }}>
            {listItem.type === 'pdf' ? (
              <Grid container spacing={1}>
                {/*se define que icono se utiliza*/}
                <Grid item sx={{ marginRight: '8px' }}>
                  <PictureAsPdf
                    color="error"
                    sx={{ width: '40px', height: '40px' }}
                  />
                </Grid>
                {/*se agrega el contenido*/}
                <Grid item>
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {listItem.title}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {`${sizeInMB(listItem.description)} MB`}
                  </Typography>
                </Grid>
                {/*se agregan los botones con sus funcionalidades*/}
                <Grid item sx={{ marginLeft: 'auto' }}>
                  {listItem.buttons &&
                    listItem.buttons.length &&
                    listItem.buttons.map((btn, indexB) =>
                      btn.icon === 'download' ? (
                        <ApsFileDownloadLink
                          key={indexB}
                          fileName={listItem.title}
                          url={listItem.urlFile}
                        >
                          <IconButton
                            onClick={() => btn.onClick(listItem)}
                            sx={{ ...btn.styles }}
                          >
                            <Download color="primary" />
                          </IconButton>
                        </ApsFileDownloadLink>
                      ) : (
                        btn.icon === 'delete' && (
                          <IconButton
                            key={indexB}
                            onClick={() => btn.onClick(listItem)}
                            sx={{ ...btn.styles }}
                          >
                            <Delete color="error" />
                          </IconButton>
                        )
                      )
                    )}
                </Grid>
              </Grid>
            ) : listItem.type === 'button' ? (
              <Grid container key={index} spacing={1}>
                <Button
                  onClick={() => listItem.onClick(listItem)}
                  sx={stylesButton}
                >
                  {/*se define que icono se utiliza*/}
                  <Grid item sx={{ marginRight: '16px' }}>
                    <Avatar />
                  </Grid>
                  {/*se agrega el contenido*/}
                  <Grid item sx={{ marginRight: 'auto' }}>
                    <Typography
                      variant="body1"
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {listItem.title}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {listItem.description}
                    </Typography>
                  </Grid>
                  {/*se agregan los botones con sus funcionalidades*/}
                  {listItem.isSelected && (
                    <Grid item sx={stylesGreenCheck}>
                      <CheckCircle color="success" />
                    </Grid>
                  )}
                </Button>
              </Grid>
            ) : (
              listItem.type === 'simple' && (
                <Grid container spacing={1}>
                  {/*se agrega el contenido*/}
                  <Grid item>
                    <Typography variant="body1" color="primary">
                      {`${listItem.title} / ${listItem.description}`}
                    </Typography>
                  </Grid>
                </Grid>
              )
            )}
            {props.isDivided && index < props.listItems.length - 1 && (
              <Divider sx={{ marginTop: '8px' }} />
            )}
          </Grid>
        ))) || <Typography align="center">No files uploaded yet</Typography>}
    </Grid>
  );
};

export default React.memo(StyledList);
