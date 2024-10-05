import { useSelector } from 'react-redux';
import ApsModal from './ApsModal';
import { useDispatch } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../app/store/modules/main';

const ApsGlobalModal = () => {
  const dispatch = useDispatch();

  const onClose = () => {
    apsGlobalModalProps.onClose
      ? apsGlobalModalProps.onClose()
      : dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const apsGlobalModalProps = useSelector(
    (state) => state.main.components.apsGlobalModalProps
  );

  const modalProps = { ...apsGlobalModalProps };

  if (
    typeof modalProps.handleCancel === 'boolean' &&
    modalProps.handleCancel
  ) {
    modalProps.handleCancel = onClose;
  }

  return <ApsModal {...modalProps} onClose={onClose} />;
};

export default ApsGlobalModal;
