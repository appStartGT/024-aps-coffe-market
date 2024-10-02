import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Save } from '@mui/icons-material';
import { Paper } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMountEffect } from '@hooks';
import ApsForm from '@components/ApsForm';
import ApsButton from '@components/ApsButton';
import { Actions, Subjects } from '@config/permissions';
import Can, { Ability } from '@components/permissions/Can';
import ApsInfoAlert from '@components/ApsInfoAlert';
import useEmployeeDetailForm from './useEmployeeDetailForm';

import {
  clearEmployeePaymentSelected,
  clearEmployeeSelected,
  employeeGetOneAction,
} from '../../../../store/modules/employee';
import { useSelector } from 'react-redux';
import Payments from '../components/Payments';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const useOrganizationDetail = () => {
  /* HOOKS */
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const ability = Ability();
  const lastLocation = location?.substring(
    0,
    location.lastIndexOf('/', location.lastIndexOf('/') - 1)
  );
  const { formikEmployee, handleOnclick, employeeSelected, loading } =
    useEmployeeDetailForm({ navigate });

  const employeePaymentSelected = useSelector(
    (state) => state.employee.employeePaymentSelected
  );

  const processing = useSelector((state) => state.employee.processing);

  /* USE EFFECTS */
  useMountEffect({
    effect: () => {
      if (params.id_employee != 0) {
        dispatch(employeeGetOneAction({ id: params.id_employee }));
      }
    },
  });

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS
    return () => {
      dispatch(clearEmployeeSelected());
      dispatch(clearEmployeePaymentSelected());
    };
  }, []);

  const canDetails = {
    key: 'can-hospitalario-details',
    I: Actions.EDIT,
    a: Subjects.EMPLOYEES,
  };

  const propsButtonSaveDetails = {
    endIcon: <Save />,
    variant: 'contained',
    children: 'Guardar',
    style: { borderRadius: 8 },
    color: 'primary',
    size: 'large',
    disabled: !formikEmployee.form.isValid || loading,
    onClick: () => handleOnclick(),
    can: canDetails,
  };

  const propsTabsComponent = () => {
    let tabs = [];
    ability.can(Actions.EMPLOYEES_TAB_DETALLES, Subjects.EMPLOYEES) &&
      tabs.push({
        title: 'Detalles',
        content: (
          <Paper sx={stylesPaper}>
            <Can not {...canDetails}>
              <ApsInfoAlert
                severity="error"
                text="No tienes permisos para modificar el registro."
              />
            </Can>
            <ApsForm title="" formik={formikEmployee} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '32px',
              }}
            >
              <ApsButton {...propsButtonSaveDetails} />
            </div>
          </Paper>
        ),
      });

    if (params.id_employee != 0) {
      ability.can(Actions.EMPLOYEES_TAB_PAGOS, Subjects.EMPLOYEES) &&
        tabs.push({
          title: 'Pagos',
          content: (
            <Payments
              employeePaymentSelected={employeePaymentSelected}
              processing={processing}
              employeeSelected={employeeSelected}
            ></Payments>
          ),
        });
    }
    return { tabs: tabs };
  };

  return {
    formikEmployee,
    handleOnclick,
    employeeSelected,
    lastLocation,
    navigate,
    params,
    propsTabsComponent,
  };
};

export default useOrganizationDetail;
