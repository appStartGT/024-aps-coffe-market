import React from 'react';
import GeneralContainer from '@components/generalContainer/GeneralContainer';
import { useNavigate } from 'react-router-dom';
import TabsComponent from '@components/tabs/TabsComponent';
import useRolDetail from '../hooks/useRolDetail';
import ApsForm from '@components/ApsForm';
import RolPermission from './../pages/RolPermission';
import { Paper } from '@mui/material';
import ApsButton from '@components/ApsButton';
import { Actions, Subjects } from '@config/permissions';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const RolDetailPage = () => {
  /* Hooks */
  const { formik, propsButtonSaveRolDetails, selectedRole } = useRolDetail();
  const navigate = useNavigate();

  const propsTabsComponent = {
    tabs: [
      {
        title: 'Detalles',
        content: (
          <Paper sx={stylesPaper}>
            <ApsForm title="" formik={formik} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'right',
              }}
            >
              <ApsButton {...propsButtonSaveRolDetails} />
            </div>
          </Paper>
        ),
      },
      {
        title: 'Permisos',
        content: <RolPermission />,
        disabled: !selectedRole?.id_role,
        can: {
          key: 'can-configure-role-permissions',
          I: Actions.ADMINSTRADOR_TAB_ROLES_PERMISOS,
          a: Subjects.ADMINISTRADOR_TAB_ROLES,
        },
      },
    ],
  };

  return (
    <GeneralContainer
      title={`Rol ${selectedRole?.name || ''}`}
      subtitle="Detalles del rol."
      actions={[]}
      backFunction={() => navigate(`/main/administrator`)}
      container={<TabsComponent nopaper {...propsTabsComponent} />}
    />
  );
};
export default RolDetailPage;
