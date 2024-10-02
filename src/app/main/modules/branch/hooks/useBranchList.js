import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Typography } from '@mui/material';
import {
  branchListAction,
  branchDeleteAction,
} from '../../../../store/modules/branch/index';
import { Actions, Subjects } from '@config/permissions';

const UseBranchList = ({ id_organization }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const branchList = useSelector((state) => state.branch.branchList);
  const totalItems = useSelector((state) => state.branch.totalItems);
  const processing = useSelector((state) => state.branch.processing);

  const [searchList, setSearchList] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 1,
  });
  const [text, setText] = useState('');
  const [urlParts, setUrlParts] = useState('');

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/').slice(3, 5).join('/');
    setUrlParts(`/${parts}`);
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      dispatch(
        branchListAction({
          id_organization,
        })
      );
    }, 200);

    return () => clearTimeout(searchTimer);
  }, [paginationModel, text]);

  const handlePageChange = (newPage) => {
    setPaginationModel((value) => ({ ...value, page: newPage + 1 }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPaginationModel((value) => ({ ...value, pageSize: newPageSize }));
  };

  const handleCloseDelete = () => {
    setBranchToDelete({});
    setOpenModalDelete(false);
  };

  const handleOpenDelete = (data) => {
    setOpenModalDelete(true);
    setBranchToDelete(data);
  };

  const handleDelete = () => {
    dispatch(
      branchDeleteAction({
        id_branch: branchToDelete.id_branch,
      })
    );
    setOpenModalDelete(false);
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
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 170,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {params.row.id_branch && (
            <ApsIconButton
              tooltip={{ title: 'Editar registro' }}
              onClick={() =>
                navigate(
                  `${urlParts}/detail/${params.row.id_organization.id}/branch/${params.row.id_branch}`
                )
              }
              children={<Edit />}
              can={{
                key: `can-edit-organization-${params.row.id_branch}`,
                I: Actions.EDIT,
                a: Subjects.BRANCH,
              }}
            />
          )}
          {params.row.id_branch && (
            <ApsIconButton
              tooltip={{ title: 'Eliminar sucursal' }}
              onClick={() => handleOpenDelete(params.row)}
              children={<Delete color="error" />}
              can={{
                key: `can-delete-organization-${params.row.id_branch}`,
                I: Actions.DELETE,
                a: Subjects.BRANCH,
              }}
            />
          )}
        </div>
      ),
    },
  ];

  const propsSearchBarButton = {
    label: 'Buscar por Nombre / Email / Teléfono ',
    type: 'text',
    onChange: (value) => setText(value),
    rightButton: {
      icon: 'add_circle',
      onClick: () => navigate(`${urlParts}/detail/${id_organization}/branch/0`),
      color: 'primary',
      can: {
        key: 'can-create-services-record',
        I: Actions.CREATE,
        a: Subjects.BRANCH,
      },
    },
  };

  const propsModalDeleteBranch = {
    open: openModalDelete,
    onClose: handleCloseDelete,
    title: 'Eliminar sucursal',
    content: (
      <Typography>{`Está seguro que desea eliminar la sucursal "${branchToDelete.name}" permanentemente?`}</Typography>
    ),
    handleOk: handleDelete,
    titleOk: 'Eliminar',
    handleCancel: handleCloseDelete,
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
    branchList,
    pageSize,
    paginationModel,
    processing,
    propsModalDeleteBranch,
    propsSearchBarButton,
    searchList,
    setPaginationModel,
    setSearchList,
    totalItems,
  };
};

export default UseBranchList;
