import { useState } from 'react';
import { useFormikFields } from '@hooks';
import { useDispatch } from 'react-redux';
import { fieldValidations } from '@utils';
import { subjectCreateAction } from '../../../../store/modules/subject';
import { useSelector } from 'react-redux';

const useSubject = () => {
  const dispatch = useDispatch();
  const processing = useSelector((state) => state.subject.processing);
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
    dispatch(subjectCreateAction({ ...formik.form.values })).then(() =>
      setOpen(false)
    );
  };

  return {
    formik,
    handleOnClick,
    open,
    setOpen,
    processing,
  };
};

export default useSubject;
