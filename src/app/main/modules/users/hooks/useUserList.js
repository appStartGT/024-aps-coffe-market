import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useMountEffect } from '@hooks';
import { userListAction, setUserAction } from '../../../../store/modules/user';
import {
  setUserModalAction,
  setDeleteModalAction,
  deleteUserAction,
} from '../../../../store/modules/user';
import { userCatalogAction } from '../../../../store/modules/catalogs';
import { Actions } from '@config/permissions';
import ApsIconButton from '@components/ApsIconButton';

const useUserList = ({ subject, id_user_type, id_organization, id_branch }) => {
  /* Hooks */
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.user.userList);
  const processing = useSelector((state) => state.user.processing);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const isDeleteModalOpen = useSelector(
    (state) => state.user.isDeleteModalOpen
  );
  const roles = useSelector((state) => state.catalogs.roles);
  const [searchList, setSearchList] = useState(null);

  /* Use Effects */
  useMountEffect({
    effect: () => {
      dispatch(userListAction({ id_user_type, id_organization, id_branch }))
        .unwrap()
        .then(() => {
          dispatch(userCatalogAction());
        });
    },
  });

  /* Constants */
  const columns = [
    {
      field: 'id_user',
      headerName: 'ID',
      // maxWidth: 40,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
    },
    {
      field: 'email',
      headerName: 'Correo electrónico',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row?.email || 'No ingresado'}
        </Typography>
      ),
    },
    {
      field: 'rol',
      headerName: 'Rol',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        if (params.value) return params.value;

        const roleNameFromCat = roles?.find(
          (rol) => rol.value == params.row.id_role
        );

        if (roleNameFromCat) return roleNameFromCat.label;
      },
    },
    {
      field: 'isActive',
      headerName: 'Estado',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          color={params.value ? 'primary' : 'default'}
          label={params.value ? 'Activo' : 'Inactivo'}
        />
      ),
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
            tooltip={{ title: 'Edit user' }}
            onClick={() => {
              dispatch(setUserAction(params.row));
              dispatch(setUserModalAction(true));
            }}
            children={<Edit color="" />}
            can={{
              key: `can-edit-user-${params.row.id}`,
              I: Actions.EDIT,
              a: subject,
            }}
          />
          <ApsIconButton
            tooltip={{ title: 'Delete user' }}
            onClick={() => {
              dispatch(setDeleteModalAction(true));
              dispatch(setUserAction(params.row));
            }}
            children={<Delete color="error" />}
            can={{
              key: `can-delete-user-${params.row.id}`,
              I: Actions.DELETE,
              a: subject,
            }}
          />
        </>
      ),
    },
  ].filter((e) => e);

  const searchBarProps = {
    label: 'Busqueda por nombre, correo electrónico o rol.',
    type: 'text',
    searchList: userList,
    searchKey: 'name,email,rol',
    searchResults: (results) => setSearchList(results),
    rightButton: {
      icon: 'add_circle',
      onClick: () => dispatch(setUserModalAction(true)),
      color: 'primary',
      can: {
        key: `can-create-user-${subject}`,
        I: Actions.CREATE,
        a: subject,
      },
    },
  };

  const handleDelete = () => {
    dispatch(deleteUserAction({ id_user: selectedUser.id_user }));
  };

  const onClose = () => {
    dispatch(setUserAction(null));
    dispatch(setDeleteModalAction(false));
  };

  return {
    handleDelete,
    onClose,
    searchList,
    userList,
    columns,
    processing,
    searchBarProps,
    selectedUser,
    isDeleteModalOpen,
  };
};

export default useUserList;
