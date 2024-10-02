import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Typography } from '@mui/material';
import {
  organizationListAction,
  organizationDeleteAction,
} from '../../../../store/modules/organization/index';
import { Actions, Subjects } from '@config/permissions';
// import { Ability } from '@components/permissions/Can';

let searchTimer;

const UseOrganizationList = () => {
  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const ability = Ability();

  /* selectors */
  const organizationList = useSelector(
    (state) => state.organization.organizationList
  );
  const totalItems = useSelector((state) => state.organization.totalItems);
  const processing = useSelector((state) => state.organization.processing);
  /* STATES */
  /* Search */
  const [searchList, setSearchList] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 1,
  });
  const [text, setText] = useState('');

  /* use Effects */
  useEffect(() => {
    searchTimer = setTimeout(() => {
      dispatch(
        organizationListAction({
          text: text.trim() ?? undefined,
          page: paginationModel.page,
          limit: paginationModel.pageSize,
        })
      );
    }, 200);

    // Limpiamos el temporizador en cada cambio de texto
    return () => clearTimeout(searchTimer);
  }, [paginationModel, text]);

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
      field: 'telephone',
      headerName: 'Teléfono',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'address',
      headerName: 'Dirección',
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
            {params.row.id_organization && (
              <ApsIconButton
                tooltip={{ title: 'Editar registro' }}
                onClick={() => {
                  navigate(
                    `/main/organizations/detail/${params.row.id_organization}`
                  );
                }}
                children={<Edit color="" />}
                can={{
                  key: `can-edit-organization-${params.row.id_organization}`,
                  I: Actions.EDIT,
                  a: Subjects.HOSTPITALARIO,
                }}
              />
            )}
            {params.row.id_organization && (
              <ApsIconButton
                tooltip={{ title: 'Eliminar organización' }}
                onClick={() => handleOpenDelete(params.row)}
                children={<Delete color="error" />}
                can={{
                  key: `can-delete-organization-${params.row.id_organization}`,
                  I: Actions.DELETE,
                  a: Subjects.HOSTPITALARIO,
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Nombre / Email / Teléfono ',
    type: 'text',
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => navigate(`/main/organizations/detail/0`),
      color: 'primary',
      can: {
        key: 'can-create-services-record',
        I: Actions.CREATE,
        a: Subjects.HOSTPITALARIO,
      },
    },
  };

  const handleCloseDelete = () => {
    setOrganizationToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setOrganizationToDelete(data);
  };

  const handleDelete = () => {
    dispatch(
      organizationDeleteAction({
        id_organization: organizationToDelete.id_organization,
      })
    );
    setOpenModalDelete(false);
  };

  const propsModalDeleteOrganization = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar organización',
    content: (
      <Typography>{`Está seguro que desea eliminar la organización "${organizationToDelete.name}" permanentemente?`}</Typography>
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

  return {
    columns,
    handlePageChange,
    handlePageSizeChange,
    organizationList,
    pageSize,
    paginationModel,
    processing,
    propsModalDeleteOrganization,
    propsSearchBarButton,
    searchList,
    setPaginationModel,
    setSearchList,
    totalItems,
  };
};

export default UseOrganizationList;
