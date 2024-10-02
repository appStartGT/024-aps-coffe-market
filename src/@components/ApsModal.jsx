import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  DialogContentText,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ApsModal(props) {
  const {
    title = 'Título del diálogo',
    description,
    content,
    titleOk = 'Aceptar',
    handleOk = null,
    variantOk = 'contained',
    titleCancel = 'Cancelar',
    handleCancel = null,
    open,
    onClose,
    loading,
    titleProps,
    contentProps,
    actionsProps,
    dialogProps,
    fullWidth = true,
    maxWidth = 'sm',
    okProps,
    cancelProps,
    descriptionProps,
    descriptionTypographyProps,
    closeBtn,
  } = props;

  return (
    <Dialog
      id="alert-dialog"
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={loading}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: '16px',
        },
      }}
      // sx={{padding:20}}
      {...dialogProps}
    >
      {title && (
        <DialogTitle
          id="alert-dialog-title"
          component="div"
          sx={{
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '16px',
            paddingBottom: '8px',
          }}
          display={'flex'}
          justifyContent={'center'}
        >
          {typeof title == 'string' ? (
            <Typography
              variant="h4"
              sx={(theme) => ({ color: theme.palette.blackLight.main })}
              {...titleProps}
            >
              {title}
            </Typography>
          ) : (
            title
          )}
          {closeBtn ? (
            <IconButton
              aria-label="close"
              style={{ position: 'absolute', right: 24, top: 16, padding: 0 }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
      )}
      {description && (
        <DialogContentText
          component="div"
          sx={{ paddingLeft: '24px', paddingRight: '24px' }}
          display={'flex'}
          justifyContent={'center'}
          {...descriptionProps}
        >
          <Typography
            variant="body1"
            children={description}
            {...descriptionTypographyProps}
          />
        </DialogContentText>
      )}
      {content && (
        <DialogContent
          id="alert-dialog-content"
          // sx={{ padding: { xs: 2, sm: 4, md: 6 } }}
          {...contentProps}
        >
          {content}
        </DialogContent>
      )}
      {(handleCancel || handleOk) && (
        <DialogActions
          style={{ padding: '20px' }}
          id="alert-dialog-actions"
          {...actionsProps}
        >
          {handleCancel && (
            <Button
              style={{ borderRadius: 8 }}
              onClick={handleCancel}
              color="primary"
              autoFocus
              variant="outlined"
              {...cancelProps}
            >
              {titleCancel}
            </Button>
          )}
          {handleOk && (
            <Button
              style={{ borderRadius: 8 }}
              onClick={handleOk}
              color="primary"
              variant={variantOk}
              {...okProps}
            >
              {titleOk}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
export default React.memo(ApsModal);
