import React, { useState, useEffect } from 'react';
import { useAuth, useFormikFields, useMountEffect } from '@hooks';
import { LocationOn, Money, Phone, RecentActors } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  employeeCreateAction,
  employeeUpdateAction,
} from '../../../../store/modules/employee/index';
import { branchListAction } from '../../../../store/modules/branch/index';
import { fieldValidations } from '@utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Email from '@mui/icons-material/Email';
import ApsFileUpload from '@components/ApsFileUpload';

const useEmployeeDetailForm = ({ navigate }) => {
  /* HOOKS */
  const dispatch = useDispatch();
  const { id_employee } = useParams();
  const auth = useAuth();

  /* SELECTORS */
  const loading = useSelector((state) => state.employee.processing);
  const branchList = useSelector((state) => state.branch.branchListForSelect);
  const employeeSelected = useSelector(
    (state) => state.employee.employeeSelected
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [blockCampo, setBlockCampo] = useState(false);

  const formikEmployee = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre',
        name: 'name',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '11',
        gridItem: true,
        field: 'custom',
        gridProps: { md: 3 },
        children: (
          <ApsFileUpload
            label="Foto del empleado ."
            accept="image/png,image/jpg,image/jpeg,image/gif"
            onChange={(file) => {
              formikEmployee.form.setFieldValue('photo', file);
              setSelectedFile(file);
            }}
            value={selectedFile}
          />
        ),
      },
      {
        id: '133',
        label: 'Puesto',
        name: 'job',
        gridItem: true,
        gridProps: { md: 3 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '10',
        label: 'Correo electrónico',
        name: 'email',
        gridItem: true,
        gridProps: { md: 3 },
        validations: fieldValidations.emailRequired,
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        },
      },
      {
        id: '3',
        label: 'Teléfono',
        name: 'telephone',
        gridItem: true,
        validations: fieldValidations.telephoneRequired,
        gridProps: { md: 3 },
        inputProps: { maxLength: 8 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Phone />
            </InputAdornment>
          ),
        },
      },
      {
        id: '5',
        label: 'NIT',
        name: 'nit',
        gridItem: true,
        gridProps: { md: 3 },
        inputProps: { maxLength: 20 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <RecentActors />
            </InputAdornment>
          ),
        },
      },
      {
        id: '332',
        label: 'Sucursal',
        name: 'branch',
        field: 'autocomplete',
        gridItem: true,
        gridProps: { md: 3 },
        validations: fieldValidations.requiredSelect,
        options: branchList,
        disabled: blockCampo,
      },
      {
        id: '911',
        label: 'Salario',
        name: 'salario',
        gridItem: true,
        gridProps: { md: 3 },
        inputProps: { maxLength: 20 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <Money />
            </InputAdornment>
          ),
        },
        validations: fieldValidations.required,
      },
      {
        id: '91',
        label: 'No. Cuenta',
        name: 'cuenta',
        gridItem: true,
        gridProps: { md: 3 },
        inputProps: { maxLength: 20 },
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <RecentActors />
            </InputAdornment>
          ),
        },
      },
      {
        id: '94',
        label: 'Tipo de cuenta',
        name: 'tipo_cuenta',
        gridItem: true,
        gridProps: { md: 3 },
        inputProps: { maxLength: 20 },
      },

      {
        id: '92',
        label: 'Banco',
        name: 'banco',
        gridItem: true,
        gridProps: { md: 3 },
        inputProps: { maxLength: 20 },
      },
      {
        id: '8',
        label: 'Dirección',
        name: 'address',
        gridItem: true,
        gridProps: { md: 12 },
        inputProps: { maxLength: 255 },
        validations: fieldValidations.requiredCustom(
          'La dirección es requerida.'
        ),
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <LocationOn />
            </InputAdornment>
          ),
        },
      },
      {
        id: '13',
        label: 'Descripción',
        name: 'description',
        gridItem: true,
        multiline: true,
        rows: 4,
        gridProps: { md: 12 },
        inputProps: { maxLength: 3000 },
        validations: fieldValidations.description,
      },
    ],
  });

  useMountEffect({
    effect: () => {
      dispatch(
        branchListAction({ id_organization: auth?.user?.id_organization })
      );
      if (employeeSelected) {
        formikEmployee.form.setValues(employeeSelected);
        setSelectedFile({
          ...employeeSelected?.photoMetadata,
          photo: employeeSelected?.photo,
        });
      }
    },
    deps: [employeeSelected],
  });

  const handleOnclick = () => {
    if (id_employee != 0) {
      let body = { ...formikEmployee.form.values };

      dispatch(
        employeeUpdateAction({
          ...body,
          id_employee: id_employee,
          id_organization: auth?.user?.id_organization,
        })
      );
    } else {
      dispatch(
        employeeCreateAction({
          ...formikEmployee.form.values,
          id_organization: auth?.user?.id_organization,
          id_branch: formikEmployee?.form?.values?.branch?.value,
        })
      )
        .unwrap()
        .then((data) => {
          navigate(`/main/employee/detail/${data.id_employee}`);
        });
    }
  };

  useEffect(() => {
    if (auth?.user?.id_branch) {
      const branchObject = branchList.find(
        (branch) => branch.value === auth.user.id_branch
      );

      // Verificar si encontramos el objeto y luego actualizar los valores del formulario
      if (branchObject) {
        formikEmployee.form.setValues({
          ...formikEmployee.form.values,
          branch: branchObject,
        });
        setBlockCampo(true);
      }
    }
  }, [auth?.user?.id_branch]);

  return {
    formikEmployee,
    handleOnclick,
    employeeSelected,
    loading,
  };
};

export default useEmployeeDetailForm;
