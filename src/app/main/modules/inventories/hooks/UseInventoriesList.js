import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Typography } from '@mui/material';
import {
  inventoryListAction,
  inventoryDeleteAction,
} from '../../../../store/modules/inventory';
import { Actions, Subjects } from '@config/permissions';
import { useAuth, useMountEffect } from '@hooks';
import { branchListAction } from '../../../../store/modules/branch/index';

import { clearProductInventoryListAction } from '../../../../store/modules/productInventory';
// import { Ability } from '@components/permissions/Can';

const UseInventoriesList = () => {
  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();
  // const ability = Ability();

  /* selectors */
  const inventoryList = useSelector((state) => state.inventory.inventoryList);
  const totalItems = useSelector((state) => state.inventory.totalItems);
  const processing = useSelector((state) => state.inventory.processing);

  const productInventoryList = useSelector(
    (state) => state.productInventory.productInventoryList
  );

  /* STATES */
  /* Search */
  const [searchList, setSearchList] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [inventoryToDelete, setEmployeeToDelete] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 1,
  });
  const [, setText] = useState('');

  const branchList = useSelector((state) => state.branch.branchListForSelect);
  /* use Effects */

  useEffect(() => {
    dispatch(
      branchListAction({ id_organization: auth?.user?.id_organization })
    );
    dispatch(
      inventoryListAction({
        id_organization: auth?.user?.id_organization,
        id_branch: auth?.user?.id_branch,
      })
    );
  }, []);
  const handlePageChange = (newPage) => {
    setPaginationModel((value) => ({ ...value, page: newPage + 1 }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPaginationModel((value) => ({ ...value, pageSize: newPageSize }));
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'sucursal',
      headerName: 'Sucursal',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      headerAlign: 'center',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 'fullWidth',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 170,
      sticky: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {params.row.id_inventory && (
              <ApsIconButton
                tooltip={{ title: 'Editar registro' }}
                onClick={() =>
                  navigate(
                    `/main/inventory/detail/${params.row.id_inventory}/${params.row.id_branch}`
                  )
                }
                children={<Edit color="" />}
                /* can={{
                  key: `can-edit-inventory-${params.row.id_inventory}`,
                  I: Actions.EDIT,
                  a: Subjects.EMPLOYEES,
                }} */
              />
            )}
            {params.row.id_inventory && (
              <ApsIconButton
                tooltip={{ title: 'Eliminar empleado' }}
                onClick={() => handleOpenDelete(params.row)}
                children={<Delete color="error" />}
                /*  can={{
                  key: `can-delete-inventory-${params.row.id_inventory}`,
                  I: Actions.DELETE,
                  a: Subjects.EMPLOYEES,
                }} */
              />
            )}
          </div>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Nombre ',
    type: 'text',
    searchList: inventoryList,
    searchKey: 'name, email, job, address',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setText(value),
    rightButton:
      inventoryList?.length !== branchList?.length
        ? {
            icon: 'add_circle',
            onClick: () => navigate(`/main/inventory/detail/0/0`),
            color: 'primary',
            can: {
              key: 'can-create-services-record',
              I: Actions.CREATE,
              a: Subjects.EMPLOYEES,
            },
          }
        : null,
  };

  const handleCloseDelete = () => {
    setEmployeeToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setEmployeeToDelete(data);
  };

  const handleDelete = () => {
    dispatch(
      inventoryDeleteAction({
        id_inventory: inventoryToDelete.id_inventory,
      })
    );
    setOpenModalDelete(false);
  };

  const propsModalDeleteOrganization = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar empleado',
    content: (
      <Typography>{`Está seguro que desea eliminar la empleado "${inventoryToDelete.name}" permanentemente?`}</Typography>
    ),
    handleOk: () => handleDelete(),
    titleOk: 'Eliminar',
    handleCancel: () => handleCloseDelete(),
    titleCancel: 'Cancelar',
    okProps: {
      color: 'error',
      endIcon: <Delete />,
    },
  };
  const labels = {
    name: 'Nombre',
    address: 'Dirección',
    email: 'Correo',
    job: 'Puesto',
    telephone: 'Telefono',
  };
  const fields = ['name', 'address', 'email', 'sucursal', 'job', 'telephone'];

  useMountEffect({
    effect: () => {
      productInventoryList.length &&
        dispatch(clearProductInventoryListAction());
    },
    deps: [],
  });

  return {
    columns,
    handlePageChange,
    handlePageSizeChange,
    inventoryList,
    pageSize,
    paginationModel,
    processing,
    propsModalDeleteOrganization,
    propsSearchBarButton,
    searchList,
    setPaginationModel,
    setSearchList,
    totalItems,
    labels,
    fields,
  };
};

export default UseInventoriesList;
