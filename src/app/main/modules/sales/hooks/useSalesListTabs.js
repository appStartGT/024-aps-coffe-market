import React from 'react';
import { Actions, Subjects } from '@config/permissions';
import { Ability } from '@components/permissions/Can';
import TabSales from '../pages/TabSales';
/* import TabServicesSales from '../pages/TabServicesSales';
import TabInternUse from '../pages/TabInternUse'; */

const useSalesListTabs = () => {
  const ability = Ability();

  const propsTabsComponent = () => {
    let tabs = [];

    ability.can(Actions.VENTAS_TAB_STORE, Subjects.VENTAS) &&
      tabs.push({
        title: 'Tienda',
        content: <TabSales />,
      });

    /*  ability.can(Actions.VENTAS_TAB_HOSPITALARIO, Subjects.VENTAS) &&
      tabs.push({
        title: 'Servicios',
        content: <TabServicesSales />,
      });

    ability.can(Actions.VENTAS_TAB_USO_SANATORIO, Subjects.VENTAS) &&
      tabs.push({
        title: 'Uso interno',
        content: <TabInternUse />,
      }); */

    return { tabs };
  };

  return {
    propsTabsComponent: propsTabsComponent(),
  };
};

export default useSalesListTabs;
