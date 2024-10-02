import toast from 'react-hot-toast';
import { CustomToast } from '@components/ToastAlert';

export const showToast = ({ variant, title, message } = {}) => {
  return toast((t) => CustomToast({ toast: t, variant, title, message }), {
    duration: 10000,
    position: 'bottom-right',
    style: {
      minWidth: '300px',
    },
  });
};

export const MESSAGES = {
  CREATE: {
    SUCCESS: '',
    ERROR: 'Si el problema persiste contacte a soporte.',
  },
  ERROR_PERSIST: 'Si el problema persiste contacte a soporte.',
  LOGIN_ERROR: 'Verifique sus credenciales e intente nuevamente.',
};
