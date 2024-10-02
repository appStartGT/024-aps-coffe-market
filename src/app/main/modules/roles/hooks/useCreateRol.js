import { useFormikFields } from '@hooks';
import { useDispatch } from 'react-redux';
import { createRoleAction } from '../../../../../app/store/modules/role';
import { fieldValidations, activeSelectOptions } from '@utils';

const useCreateRol = () => {
  const dispatch = useDispatch();

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre',
        name: 'name',
        gridItem: true,
        inputProps: { maxLength: 50 },
        validations: fieldValidations.required,
      },
      {
        id: '2',
        label: 'Estado',
        name: 'isActive',
        field: 'select',
        gridItem: true,
        options: activeSelectOptions,
        value: true,
      },
      {
        id: '3',
        label: 'Descripción',
        name: 'description',
        gridItem: true,
        multiline: true,
        rows: 4,
        gridProps: { md: 12 },
        inputProps: { maxLength: 300 },
        validations: fieldValidations.description,
      },
    ],
  });

  const handleOnClick = () => {
    dispatch(createRoleAction({ ...formik.form.values }));
  };

  return { formik, handleOnClick };
};

export default useCreateRol;
