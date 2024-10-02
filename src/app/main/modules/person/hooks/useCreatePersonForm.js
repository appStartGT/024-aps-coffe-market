import { useEffect } from 'react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useFormikFields, useMountEffect } from '@hooks';
import { fieldValidations } from '@utils';
import {
  createPersonAction,
  setPersonAction,
  setPersonModalAction,
  updatePersonAction,
} from '../../../../store/modules/person';
import { personTypeCatalogAction } from '../../../../store/modules/catalogs';

const useCreatePersonForm = () => {
  const dispatch = useDispatch();
  const selectedPerson = useSelector((state) => state.person.selectedPerson);
  const processing = useSelector((state) => state.person.processing);
  const isPersonModalOpen = useSelector(
    (state) => state.person.isPersonModalOpen
  );
  const personType = useSelector((state) => state.catalogs.personType);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombres',
        name: 'names',
        gridItem: true,
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '2',
        label: 'Apellidos',
        name: 'surNames',
        gridItem: true,
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '4',
        label: 'Elija un tipo',
        name: 'id_person_type',
        field: 'select',
        gridItem: true,
        options: personType,
        gridProps: { md: 4 },
        validations: fieldValidations.required,
      },
      {
        id: '7',
        label: 'DPI',
        name: 'DPI',
        gridItem: true,
        gridProps: { md: 4 },
        inputProps: { maxLength: 20 },
        validations: yup
          .number()
          .typeError('DPI debe de ser un numero')
          // .required('Requerido')
          .min(13, 'Debe contener almenos 13 caracteres'),
      },
      {
        id: '6',
        label: 'Teléfono',
        name: 'phone',
        gridItem: true,
        inputProps: { maxLength: 20 },
        gridProps: { md: 4 },
        validations: yup
          .number()
          .typeError('Teléfono debe de ser un número válido.')
          .min(8, 'Debe contener almenos 8 caracteres'),
        // validations: fieldValidations.required,
      },
    ].filter((e) => e),
  });

  useMountEffect({
    effect: () => dispatch(personTypeCatalogAction()),
  });

  useEffect(() => {
    if (selectedPerson && Object.keys(selectedPerson).length) {
      formik.form.setValues({ ...selectedPerson }); //validate whether the password should be displayed
    } else {
      formik.clearForm();
    }
  }, [selectedPerson]);

  const handleOnclick = () => {
    if (selectedPerson && selectedPerson.id_person) {
      //update
      dispatch(
        updatePersonAction({
          ...formik.form.values,
          id_person: selectedPerson.id_person,
        })
      );
    } else {
      dispatch(
        createPersonAction({
          ...formik.form.values,
          isExternal: true,
        })
      );
    }
  };

  const onClose = () => {
    dispatch(setPersonAction(null));
    dispatch(setPersonModalAction(false));
  };

  return {
    handleOnclick,
    onClose,
    formik,
    processing,
    isPersonModalOpen,
    selectedPerson,
  };
};

export default useCreatePersonForm;
