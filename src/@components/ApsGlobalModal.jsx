import { useSelector } from 'react-redux';
import ApsModal from './ApsModal';
import { useDispatch } from 'react-redux';
import { setApsGlobalModalPropsAction } from '../app/store/modules/main';

const ApsGlobalModal = () => {
  const dispatch = useDispatch();

  const onClose = () => {
    // dispatch(setApsGlobalModalPropsAction({ open: false }));
    apsGlobalModalProps.onClose
      ? apsGlobalModalProps.onClose()
      : dispatch(setApsGlobalModalPropsAction({ open: false }));
  };

  const apsGlobalModalProps = useSelector(
    (state) => state.main.components.apsGlobalModalProps
  );
  return <ApsModal {...apsGlobalModalProps} onClose={onClose} />;
};

export default ApsGlobalModal;
