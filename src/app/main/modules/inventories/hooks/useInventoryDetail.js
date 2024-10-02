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
import useInventoryDetailForm from './useInventoryDetailForm';

import {
  clearInventorySelected,
  inventoryGetOneAction,
} from '../../../../store/modules/inventory';
import ListProduct from '../components/inventoriesByProducts/ListProducts';
import CombosCards from '../components/combos/CombosCards';

const stylesPaper = {
  padding: '16px',
  borderRadius: '12px',
};

const useInventoryDetail = () => {
  /* HOOKS */
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const ability = Ability();
  const baseIndex = location.indexOf('/inventory') + '/inventory'.length;

  // Usa substring para cortar la URL hasta ese índice
  const lastLocation = location.substring(0, baseIndex);
  const { formikInventory, handleOnclick, inventorySelected, loading } =
    useInventoryDetailForm({ navigate });

  // const processing = useSelector((state) => state.inventory.processing);

  /* USE EFFECTS */
  useMountEffect({
    effect: () => {
      if (params.id_inventory != 0) {
        dispatch(inventoryGetOneAction({ id: params.id_inventory }));
      }
    },
  });

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS
    return () => {
      dispatch(clearInventorySelected());
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
    disabled: !formikInventory.form.isValid || loading,
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
            <ApsForm title="" formik={formikInventory} />
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

    if (params.id_inventory != 0) {
      ability.can(Actions.EMPLOYEES_TAB_PAGOS, Subjects.EMPLOYEES) &&
        tabs.push({
          title: 'Inventario',
          content: (
            <>
              <ListProduct></ListProduct>
            </>
          ),
        });
    }
    if (params.id_inventory != 0) {
      ability.can(Actions.EMPLOYEES_TAB_PAGOS, Subjects.EMPLOYEES) &&
        tabs.push({
          title: 'Combos',
          content: (
            <>
              <CombosCards></CombosCards>
            </>
          ),
        });
    }
    return { tabs: tabs };
  };

  return {
    formikInventory,
    handleOnclick,
    inventorySelected,
    lastLocation,
    navigate,
    params,
    propsTabsComponent,
  };
};

export default useInventoryDetail;
