import { useState, useEffect } from 'react';
import { useAuth, useFormikFields, useMountEffect } from '@hooks';

import { useDispatch } from 'react-redux';
import {
  inventoryCreateAction,
  inventoryUpdateAction,
} from '../../../../store/modules/inventory';
import { branchListAction } from '../../../../store/modules/branch/index';
import { fieldValidations } from '@utils';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const useEmployeeDetailForm = ({ navigate }) => {
  /* HOOKS */
  const dispatch = useDispatch();
  const { id_inventory, id_branch } = useParams();
  const auth = useAuth();

  /* SELECTORS */
  const loading = useSelector((state) => state.inventory.processing);
  const branchList = useSelector((state) => state.branch.branchListForSelect);
  const inventorySelected = useSelector(
    (state) => state.inventory.inventorySelected
  );

  const [blockCampo, setBlockCampo] = useState(false);

  const formikInventory = useFormikFields({
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
        id: '332',
        label: 'Sucursal',
        name: 'branch',
        field: 'autocomplete',
        gridItem: true,
        gridProps: { md: 6 },
        validations: fieldValidations.requiredSelect,
        options: branchList,
        disabled: blockCampo,
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
      if (id_inventory != 0) {
        formikInventory.form.setValues({
          ...formikInventory.form.values,
          name: inventorySelected?.name,
          branch: {
            label: inventorySelected?.branch,
            value: inventorySelected?.id_branch,
          },
          description: inventorySelected?.description,
        });
      }
    },
    deps: [inventorySelected],
  });

  const handleOnclick = () => {
    if (id_inventory != 0) {
      let body = { ...formikInventory.form.values };
      dispatch(
        inventoryUpdateAction({
          id_inventory: id_inventory,
          ...body,
        })
      );
    } else {
      dispatch(
        inventoryCreateAction({
          ...formikInventory.form.values,
          id_organization: auth?.user?.id_organization,
          id_branch: formikInventory?.form?.values?.branch?.value,
        })
      )
        .unwrap()
        .then((data) => {
          navigate(`/main/inventory/detail/${data.id}/${data.id_branch.id}`);
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
        formikInventory.form.setValues({
          ...formikInventory.form.values,
          branch: branchObject,
        });
        setBlockCampo(true);
      }
    }
    auth?.user?.id_branch && id_branch && setBlockCampo(true);
  }, [auth?.user?.id_branch]);

  return {
    formikInventory,
    handleOnclick,
    inventorySelected,
    loading,
  };
};

export default useEmployeeDetailForm;
