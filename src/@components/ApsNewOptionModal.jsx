import React from 'react';
import ApsModal from '@components/ApsModal';
import { Save } from '@mui/icons-material';
import ApsForm from '@components/ApsForm';
import { useFormikFields, useUpdateEffect } from '@hooks';
import {
  insertNewOptionAction,
  newOptionModalAction,
} from '../app/store/modules/catalogs';
import { useDispatch, useSelector } from 'react-redux';
import { fieldValidations } from '@utils';

const ApsNewOptionModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.catalogs.newOptionModal.open);
  let fields = useSelector((state) => state.catalogs.newOptionModal.fields);
  const catalog = useSelector((state) => state.catalogs.newOptionModal.catalog);
  const processing = useSelector((state) => state.catalogs.processing);
  const inputValue = useSelector(
    (state) => state.catalogs.newOptionModal.inputValue
  );
  if (!fields.length) {
    fields = [
      {
        id: '1',
        label: 'Nombre',
        name: 'name',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
        value: inputValue || '',
      },
    ];
  }
  const formikModal = useFormikFields({ fields: fields });

  /* Set the value in the form by default */
  useUpdateEffect(() => {
    if (inputValue) formikModal.form.setValues({ name: inputValue });
  }, [inputValue]);

  const handleClose = () => {
    formikModal.clearForm();
    dispatch(newOptionModalAction({ open: false }));
  };
  const handleSave = () => {
    dispatch(insertNewOptionAction({ ...formikModal.form.values, catalog }));
    handleClose();
  };

  return (
    <ApsModal
      open={open}
      onClose={handleClose}
      maxWidth={fields.length > 1 ? 'md' : 'xs'}
      title="Nuevo"
      description="Agregar una nueva opción al catálogo"
      content={<ApsForm title="" formik={formikModal} />}
      handleOk={handleSave}
      titleOk="Guardar"
      handleCancel={handleClose}
      titleCancel="Cancelar"
      okProps={{
        disabled: !formikModal.form.isValid || processing,
        endIcon: <Save />,
      }}
    />
  );
};

export default ApsNewOptionModal;
