import React from 'react';
import { makeStyles } from '@mui/styles';
import Viewer from 'react-viewer';

const useStyles = makeStyles(() => ({
  imageViewerContainer: {
    position: 'relative',
    zIndex: 9999, // Puedes ajustar este valor según sea necesario
  },
}));

const ImageViewer = ({ open, images = [], ...props }) => {
  const classes = useStyles();

  return (
    <div className={classes.imageViewerContainer}>
      <Viewer
        visible={open}
        onClose={() => {
          setOpenViewer(false);
        }}
        images={images}
        zIndex={9999}
        fullScreen={true}
        noFooter={true}
        {...props}
      />
    </div>
  );
};

export default React.memo(ImageViewer);
