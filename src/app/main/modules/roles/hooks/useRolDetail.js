import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormikFields, useMountEffect, useUpdateEffect } from '@hooks';
import { activeSelectOptions, fieldValidations } from '@utils';
import {
  getOneAction,
  setRoleAction,
  updateRoleAction,
} from '../../../../store/modules/role';
import { setSubjectAction } from '../../../../store/modules/subject';
import { setPermissionListAction } from '../../../../store/modules/permission';
import { Save } from '@mui/icons-material';
import { Actions, Subjects } from '@config/permissions';

const useRolDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const selectedRole = useSelector((state) => state.role.selectedRole);
  const processing = useSelector((state) => state.role.processing);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre',
        name: 'name',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 50 },
        validations: fieldValidations.requiredCustom('Name is required'),
      },
      {
        id: '2',
        label: 'Estado',
        name: 'isActive',
        field: 'select',
        gridItem: true,
        gridProps: { md: 6 },
        options: activeSelectOptions,
        value: true,
        validations: fieldValidations.requiredCustom('Status is required'),
      },
      {
        id: '4',
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

  useMountEffect({
    effect: () => {
      if (selectedRole) {
        formik.form.setValues(selectedRole);
      } else if (id) {
        dispatch(getOneAction({ id }));
      }
    },
    unMount: () => {
      dispatch(setRoleAction(null));
      dispatch(setSubjectAction(null));
      dispatch(setPermissionListAction([]));
    },
  });

  useUpdateEffect(() => {
    formik.form.setValues(selectedRole);
  }, [selectedRole]);

  const handleOnclick = () => {
    dispatch(updateRoleAction(formik.form.values));
  };

  const canDetails = {
    key: 'can-save-role-details',
    I: Actions.EDIT,
    a: Subjects.ADMINISTRADOR_TAB_ROLES,
  };

  const propsButtonSaveRolDetails = {
    endIcon: <Save />,
    children: 'Save',
    variant: 'contained',
    style: { marginTop: 32, borderRadius: 8 },
    color: 'primary',
    size: 'large',
    disabled: !formik.form.isValid || processing,
    onClick: () => handleOnclick(),
    can: canDetails,
  };

  return { formik, selectedRole, propsButtonSaveRolDetails, canDetails };
};

export default useRolDetail;
