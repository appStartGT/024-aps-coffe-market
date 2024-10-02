import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import {
  roleListAction,
  setRoleAction,
  deleteRoleAction,
  setModalOpenAction,
} from '../../../../store/modules/role';
import { useMountEffect } from '@hooks';
import { Actions, Subjects } from '@config/permissions';
import ApsIconButton from '@components/ApsIconButton';

const useRolList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roleList = useSelector((state) => state.role.roleList);
  const processing = useSelector((state) => state.role.processing);
  const isModalOpen = useSelector((state) => state.role.isModalOpen);
  const selectedRole = useSelector((state) => state.role.selectedRole);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [searchList, setSearchList] = useState(null);

  useMountEffect({
    effect: () => {
      /* !roleList.length && */ dispatch(roleListAction());
    },
    unMount: () => {},
  });

  const handleDelete = () => {
    dispatch(deleteRoleAction({ id_role: selectedRole.id_role }));
  };

  const onClose = () => {
    dispatch(setRoleAction(null));
    dispatch(setModalOpenAction(false));
  };

  const columns = [
    {
      field: 'id_role',
      headerName: 'ID',
      maxWidth: 40,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Descripción',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },

    {
      field: 'isActive',
      headerName: 'Estado',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Chip
            color={params.value ? 'primary' : 'default'}
            label={params.value ? 'Activo' : 'Inactivo'}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 'fullWidth',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <>
          <ApsIconButton
            tooltip={{ title: 'Edit role' }}
            onClick={() => {
              dispatch(setRoleAction(params.row));
              navigate(`/main/administrator/role/${params.row.id}`, {
                state: params.row,
              });
            }}
            children={<Edit color="" />}
            can={{
              key: `can-edit-role-${params.row.id}`,
              I: Actions.EDIT,
              a: Subjects.ADMINISTRADOR_TAB_ROLES,
            }}
          />
          <ApsIconButton
            tooltip={{ title: 'Delete role' }}
            onClick={() => {
              dispatch(setRoleAction(params.row));
              dispatch(setModalOpenAction(true));
            }}
            children={<Delete color="error" />}
            can={{
              key: `can-delete-role-${params.row.id}`,
              I: Actions.DELETE,
              a: Subjects.ADMINISTRADOR_TAB_ROLES,
            }}
          />
        </>
      ),
    },
  ];

  const searchBarProps = {
    label: 'Busqueda por nombre de rol.',
    type: 'text',
    searchList: roleList,
    searchKey: 'name',
    searchResults: (results) => setSearchList(results),
    rightButton: {
      icon: 'add_circle',
      onClick: () => setOpenCreateModal(true),
      color: 'primary',
      can: {
        key: 'can-create-role',
        I: Actions.CREATE,
        a: Subjects.ADMINISTRADOR_TAB_ROLES,
      },
    },
  };

  return {
    handleDelete,
    onClose,
    searchBarProps,
    roleList,
    columns,
    processing,
    searchList,
    isModalOpen,
    selectedRole,
    openCreateModal,
    setOpenCreateModal,
  };
};

export default useRolList;
