import { Box, Button, Tooltip, Typography } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import ApsLoaderPercentage from './ApsLoaderPercentage';
import PanoramaIcon from '@mui/icons-material/Panorama';
import ApsIconButton from './ApsIconButton';
import ImageViewer from './ImageViewer';
import { truncarNombreArchivo } from '@utils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

const typoGraphyStyles = (theme) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px',
  },
});

const ApsFileUpload = ({
  multiple,
  accept,
  buttonProps,
  maxSizeMB,
  required,
  value,
  isOnlyBtn = false,
  loading = false,
  progress,
  ...props
}) => {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const defaultMaxSize = import.meta.env.REACT_APP_UPLOAD_FILE_SIZE;
  const maxSize = (maxSizeMB || defaultMaxSize) * 1000000;
  const [openViewer, setOpenViewer] = useState(false);

  const sizeInMB = (size) => (size / 1000000).toFixed(2);

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.size > maxSize) {
      setError(`Tamaño maximo permitido: ${maxSizeMB || defaultMaxSize} MB`);
      event.target.value = null; // Clean value
      props.onChange && props.onChange(null);
    } else {
      setError(null);
      // setFile(selectedFile);
      props.onChange && props.onChange(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ height: '100%' }}>
      <input
        accept={accept}
        className={classes.input}
        id="contained-button-file"
        multiple={multiple}
        type={loading ? '' : 'file'}
        onChange={loading ? () => {} : handleChange}
      />
      <label htmlFor="contained-button-file">
        {loading ? (
          <ApsLoaderPercentage progress={progress} />
        ) : (
          <Button
            sx={{
              height: '100%',
              maxHeight: '56px',
              textTransform: 'none',
            }}
            fullWidth
            variant="outlined"
            component="span"
            disabled={loading}
            {...buttonProps}
            {...(required && /* !file ||  */ !value && { color: 'error' })}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box display="flex" justifyContent="center" columnGap={1}>
                <CloudUploadIcon />
                <Tooltip title={value?.name}>
                  <Typography sx={typoGraphyStyles}>
                    {value?.name
                      ? truncarNombreArchivo(value.name)
                      : '' || props.label || 'Upload'}
                  </Typography>
                </Tooltip>
              </Box>

              {!isOnlyBtn && !error && value?.size && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {value?.photo ? (
                    <>
                      <ApsIconButton
                        tooltip={{ title: 'See picture' }}
                        size="small"
                        onClick={() => {
                          setOpenViewer(true);
                        }}
                        sx={{ padding: 0 }}
                      >
                        <PanoramaIcon color="primary" />
                      </ApsIconButton>
                      <ImageViewer
                        open={openViewer}
                        onClose={() => {
                          setOpenViewer(false);
                        }}
                        images={[{ src: value.photo, alt: value.name }]}
                      />
                    </>
                  ) : null}
                  <Typography sx={typoGraphyStyles}>
                    {`Size: ${sizeInMB(value.size)} MB`}
                  </Typography>
                </div>
              )}
              {error && (
                <Typography color="error" sx={typoGraphyStyles}>
                  {error}
                </Typography>
              )}
            </Box>
          </Button>
        )}
      </label>
    </Box>
  );
};

export default ApsFileUpload;
