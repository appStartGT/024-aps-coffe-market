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
import useBranchDetailForm from './useBranchDetailForm';
import {
  clearBranchSelected,
  branchGetOneAction,
} from '../../../../store/modules/branch';
import UsersPage from '../../users/pages/UserPage';
import { CatUserType } from '@utils';

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
  const { formikBranch, handleOnclick, branchSelected, loading } =
    useBranchDetailForm({ navigate });

  /* USE EFFECTS */
  useMountEffect({
    effect: () => {
      if (params.id_branch != 0) {
        dispatch(branchGetOneAction({ id: params.id_branch }));
      }
    },
  });

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS
    return () => {
      dispatch(clearBranchSelected());
    };
  }, []);

  const canDetails = {
    key: 'can-organization-details',
    I: Actions.EDIT,
    a: Subjects.BRANCH,
  };

  const propsButtonSaveDetails = {
    endIcon: <Save />,
    variant: 'contained',
    children: 'Guardar',
    style: { borderRadius: 8 },
    color: 'primary',
    size: 'large',
    disabled: !formikBranch.form.isValid || loading,
    onClick: () => handleOnclick(),
    can: canDetails,
  };

  const propsTabsComponent = () => {
    let tabs = [];
    ability.can(Actions.EDIT, Subjects.BRANCH) &&
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
            <ApsForm title="" formik={formikBranch} />
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

    if (params.id_branch != 0) {
      ability.can(Actions.BRANCH_TAB_USERS, Subjects.BRANCH) &&
        tabs.push({
          title: 'Usuarios',
          content: (
            <UsersPage
              disableContainer={true}
              id_user_type={CatUserType.BRANCH}
              id_organization={params.id_organization}
              id_branch={params.id_branch}
              subject={Subjects.BRANCH_TAB_USERS}
            />
          ),
        });
    }
    return { tabs: tabs };
  };

  return {
    formikBranch,
    handleOnclick,
    branchSelected,
    lastLocation,
    navigate,
    params,
    propsTabsComponent,
  };
};

export default useOrganizationDetail;
