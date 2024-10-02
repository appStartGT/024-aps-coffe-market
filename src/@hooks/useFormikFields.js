import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * @param {array} fields Arreglo de objetos que definen un elemento de entrada valido.
 * @return {object} useFormik  instacia de formik 
 * 
 * 
 * ---------------------forma de objeto filelds---------------------
 * const fields = [
    {
      id: '1',
      label: 'Nombre',
      name: 'nombre',
      gridItem: true,
      validations: yup.string('Enter your email').required('Email is required'),
    },
    {
      id: '2',
      label: 'Estado',
      name: 'estado',
      gridItem: true,
      field: 'select',
      options: [
        {
          value: '1',
          label: 'Activo',
        },
        {
          value: '2',
          label: 'Inactivo',
        },
      ],
      validations: yup.string('Enter your email').required('Email is required'),
    },
  ]
 * --------------------------------------------------------
 */

const useFormikFields = ({ fields }) => {
  const [initialValues] = useState(() => {
    const values = Object.entries(fields).reduce((acc, field) => {
      const name = field[1].name;
      let intialValue = field[1].value || '';
      if (typeof field[1].value === 'number') intialValue = 0;
      if (typeof field[1].value === 'boolean') intialValue = field[1].value;
      field[1].field !== 'custom' && //custom fields don't create propertie in the form object
        Object.assign(acc, { [name]: intialValue });
      return acc;
    }, {});
    return values;
  });

  const [validationSchema] = useState(() => {
    const values = Object.entries(fields).reduce((acc, field) => {
      const name = field[1].name;
      const validations = field[1].validations;
      Object.assign(acc, { [name]: validations });
      return acc;
    }, {});
    return yup.object(values);
  });

  const form = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
  });

  const clearForm = () => {
    form.setValues(initialValues);
  };

  return {
    form,
    fields,
    clearForm,
  };
};

export default useFormikFields;
