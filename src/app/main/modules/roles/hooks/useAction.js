import { useState } from 'react';
import { useFormikFields } from '@hooks';
import { useDispatch } from 'react-redux';
import { subjectCreateActionAction } from '../../../../../app/store/modules/subject';
import { fieldValidations } from '@utils';
import { useSelector } from 'react-redux';

const useAction = () => {
  const dispatch = useDispatch();
  const actions = useSelector((state) => state.subject.actions);

  const [open, setOpen] = useState(false);
  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre',
        name: 'name',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { maxLength: 50 },
        validations: fieldValidations.required,
      },
    ],
  });

  const handleOnClick = () => {
    dispatch(subjectCreateActionAction([...actions, formik.form.values.name]));
  };

  return {
    formik,
    handleOnClick,
    open,
    setOpen,
  };
};

export default useAction;
