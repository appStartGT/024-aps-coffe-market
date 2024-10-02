import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, Subjects } from '@config/permissions';
import { Ability } from '@components/permissions/Can';
import UserPage from '../../users/pages/UserPage';
import RolListPage from '../../roles/pages/RolListPage';
import { setSelectedTab } from '../../../../store/modules/administrator';
// import PersonsPage from '../../person/pages/PersonPage';

const useAdminstrator = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.administrator.selectedTab);
  const ability = Ability();

  const propsTabsComponent = () => {
    let tabs = [];

    ability.can(Actions.ADMINSTRADOR_TAB_USUARIOS, Subjects.ADMINISTRADOR) &&
      tabs.push({
        title: 'Usuarios',
        content: <UserPage disableContainer={true} />,
        can: {
          key: 'can-use-tab-usuarios',
          I: Actions.ADMINSTRADOR_TAB_USUARIOS,
          a: Subjects.ADMINISTRADOR,
        },
      });

    // ability.can(Actions.ADMINSTRADOR_TAB_PERSONALEXT, Subjects.ADMINISTRADOR) &&
    //   tabs.push({
    //     title: 'Personal externo',
    //     content: <PersonsPage disableContainer={true} />,
    //     can: {
    //       key: 'can-use-tab-personalext',
    //       I: Actions.ADMINSTRADOR_TAB_PERSONALEXT,
    //       a: Subjects.ADMINISTRADOR,
    //     },
    //   });

    ability.can(Actions.ADMINSTRADOR_TAB_ROLES, Subjects.ADMINISTRADOR) &&
      tabs.push({
        title: 'Roles',
        content: <RolListPage disableContainer={true} />,
        can: {
          key: 'can-use-tab-roles',
          I: Actions.ADMINSTRADOR_TAB_ROLES,
          a: Subjects.ADMINISTRADOR,
        },
      });

    return {
      tabs,
      onChange: (value) => {
        dispatch(setSelectedTab(value));
      },
    };
  };

  return {
    propsTabsComponent,
    selectedTab,
  };
};

export default useAdminstrator;
