import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Delete } from '@mui/icons-material';
import {
  personListAction,
  deletePersonAction,
  setPersonAction,
  setPersonModalAction,
  setDeleteModalAction,
} from '../../../../store/modules/person';

import { Actions } from '@config/permissions';
import ApsIconButton from '@components/ApsIconButton';
import { useMountEffect } from '@hooks';

const usePersonList = ({ subject }) => {
  /* Hooks */
  const dispatch = useDispatch();
  const personList = useSelector((state) => state.person.personList);
  const processing = useSelector((state) => state.person.processing);
  const selectedPerson = useSelector((state) => state.person.selectedPerson);
  const isDeleteModalOpen = useSelector(
    (state) => state.person.isDeleteModalOpen
  );
  const roles = useSelector((state) => state.catalogs.roles);
  const [searchList, setSearchList] = useState(null);

  useMountEffect({
    effect: () => {
      dispatch(personListAction({ isExternal: true }));
    },
  });

  /* Constants */
  const columns = [
    {
      field: 'id_person',
      headerName: 'ID',
      maxWidth: 40,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'fullName',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'center',
      flex: 3,
    },
    {
      field: 'type',
      headerName: 'Tipo',
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
      field: 'actions',
      headerName: 'Acciones',
      width: 'fullWidth',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <>
          <ApsIconButton
            tooltip={{ title: 'Editar' }}
            onClick={() => {
              dispatch(setPersonAction(params.row));
              dispatch(setPersonModalAction(true));
            }}
            children={<Edit color="" />}
            can={{
              key: `can-edit-user-${params.row.id}`,
              I: Actions.EDIT,
              a: subject,
            }}
          />
          <ApsIconButton
            tooltip={{ title: 'Eliminar' }}
            onClick={() => {
              dispatch(setDeleteModalAction(true));
              dispatch(setPersonAction(params.row));
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
    label: 'Busqueda por nombre',
    type: 'text',
    searchList: personList,
    searchKey: 'fullName',
    searchResults: (results) => setSearchList(results),
    rightButton: {
      icon: 'add_circle',
      onClick: () => dispatch(setPersonModalAction(true)),
      color: 'primary',
      can: {
        key: `can-create-user-${subject}`,
        I: Actions.CREATE,
        a: subject,
      },
    },
  };

  const handleDelete = () => {
    dispatch(deletePersonAction({ id_person: selectedPerson.id_person }));
  };

  const onClose = () => {
    dispatch(setPersonAction(null));
    dispatch(setDeleteModalAction(false));
  };

  return {
    handleDelete,
    onClose,
    searchList,
    personList,
    columns,
    processing,
    searchBarProps,
    selectedPerson,
    isDeleteModalOpen,
  };
};

export default usePersonList;
