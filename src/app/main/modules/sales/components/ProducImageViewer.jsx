import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

const ProductImageViewer = ({ open, src, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogContent>
        <img src={src} alt="Producto" style={{ width: '100%' }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductImageViewer;
