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
import useOrganizationDetailForm from './useOrganizationDetailForm';
import {
  clearOrganizationSelected,
  organizationGetOneAction,
} from '../../../../store/modules/organization';
import UsersPage from '../../users/pages/UserPage';
import { CatUserType } from '@utils';
import BranchListPage from '../../branch/pages/BranchListPage';

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
  const { formikOrganization, handleOnclick, organizationSelected, loading } =
    useOrganizationDetailForm({ navigate });

  /* USE EFFECTS */
  useMountEffect({
    effect: () => {
      if (params.id_organization != 0) {
        dispatch(organizationGetOneAction({ id: params.id_organization }));
      }
    },
  });

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS
    return () => {
      dispatch(clearOrganizationSelected());
    };
  }, []);

  const canDetails = {
    key: 'can-hospitalario-details',
    I: Actions.EDIT,
    a: Subjects.ORGANIZATION,
  };

  const propsButtonSaveDetails = {
    endIcon: <Save />,
    variant: 'contained',
    children: 'Guardar',
    style: { borderRadius: 8 },
    color: 'primary',
    size: 'large',
    disabled: !formikOrganization.form.isValid || loading,
    onClick: () => handleOnclick(),
    can: canDetails,
  };

  const propsTabsComponent = () => {
    let tabs = [];
    ability.can(Actions.ORGANIZATION_TAB_DETALLES, Subjects.ORGANIZATION) &&
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
            <ApsForm title="" formik={formikOrganization} />
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

    if (params.id_organization != 0) {
      ability.can(Actions.ORGANIZATION_TAB_USERS, Subjects.ORGANIZATION) &&
        tabs.push({
          title: 'Usuarios',
          content: (
            <UsersPage
              disableContainer={true}
              id_user_type={CatUserType.ORGANIZATION}
              id_organization={params.id_organization}
            />
          ),
        });
      ability.can(Actions.ORGANIZATION_TAB_BRANCHES, Subjects.ORGANIZATION) &&
        tabs.push({
          title: 'Sucursales',
          content: <BranchListPage id_organization={params.id_organization} />,
        });
      ability.can(Actions.ORGANIZATION_TAB_BRANCHES, Subjects.ORGANIZATION) &&
        tabs.push({
          title: 'WhatsApp ChatBot',
          content: <div>proximo</div>,
        });
    }
    return { tabs: tabs };
  };

  const disableBreadcrumb = ability.can(
    Actions.DISABLE_BREADCRUMB,
    Subjects.ORGANIZATION
  );

  return {
    formikOrganization,
    handleOnclick,
    organizationSelected,
    lastLocation,
    navigate,
    params,
    propsTabsComponent,
    disableBreadcrumb,
  };
};

export default useOrganizationDetail;
