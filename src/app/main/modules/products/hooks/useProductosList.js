import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Delete, Edit } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import { Avatar, Tooltip, Typography } from '@mui/material';
import {
  // Restore as RestoreIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Actions, Subjects } from '@config/permissions';
import useRegistroProductoForm from './useRegistroProductoForm';
import {
  productsDeleteAction,
  productsListAction,
} from '../../../../store/modules/products';
import { useSelector } from 'react-redux';
import { useAuth, useMountEffect } from '@hooks';

import ImageViewer from '@components/ImageViewer';

const useTabProductosMedicamentos = () => {
  /* hooks */
  const auth = useAuth();

  const dispatch = useDispatch();
  const [openViewer, setOpenViewer] = useState(false);
  /* states */
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [flagColumns /* setFlagColumns */] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 1,
  });
  const [pageSize, setPageSize] = useState(5);
  const [, setText] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  /* selectors */
  const loading = useSelector((state) => state.products.processing);
  const tabProductosList = useSelector(
    (state) => state.products.tabProductosList
  );

  const totalItems = useSelector(
    (state) => state?.productos?.totalItemsInventario
  );
  const [searchList, setSearchList] = useState(null);
  /*  
  useMountEffect({
    effect: () => {
      searchTimer = setTimeout(() => {
        dispatch(productsListAction());
      }, 200);
    },
    unMount: () => clearTimeout(searchTimer),
      deps: [paginationModel, text], 
  }); */

  /* Use Effects */
  useMountEffect({
    effect: () => {
      let params = {};
      auth.user.id_organization &&
        (params.id_organization = auth.user.id_organization);

      dispatch(productsListAction(params));
    },
  });

  const {
    propsModalRegistroProducto,
    formikProducto,
    propsModalRegistroProvider,
    propsModalRegistroCategory,
    propsModalRegistroProductMeasureType,
  } = useRegistroProductoForm({
    loading,
    open,
    setOpen,
    id_organization: auth.user?.id_organization,
    edit,
    setEdit,
  });

  const handleDelete = () => {
    dispatch(
      productsDeleteAction({
        id_product: productoToDelete.id,
      })
    );
    handleCloseDelete();
  };

  const handleCloseDelete = () => {
    setOpenModalDelete(false);
    setProductoToDelete(null);
  };

  const handlePageChange = (newPage) => {
    setPaginationModel((value) => ({ ...value, page: newPage + 1 }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPaginationModel((value) => ({ ...value, pageSize: newPageSize }));
  };

  const columns = flagColumns
    ? [
        {
          field: 'photo',
          headerName: 'Producto',
          type: 'img',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: (item) => {
            return (
              <>
                <Avatar
                  sx={{
                    marginBottom: {
                      xs: '8px !important',
                      md: '12px !important',
                      cursor: 'pointer',
                    },
                  }}
                  color={'secondary'}
                  src={item?.row?.photo}
                  onClick={() => {
                    if (item?.row?.photo) {
                      setCurrentImage(item?.row?.photo);
                      setOpenViewer(true);
                    }
                  }}
                >
                  <PersonIcon color={'primary'} fontSize="large" />
                </Avatar>
                {openViewer && currentImage === item?.row?.photo && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <ImageViewer
                      open={openViewer}
                      onClose={() => {
                        setOpenViewer(false);
                        setCurrentImage(null);
                      }}
                      images={[{ src: currentImage, alt: 'Product image' }]}
                    />
                  </div>
                )}
              </>
            );
          },
        },
        {
          field: 'id',
          headerName: 'Codigo',
          maxWidth: 100,
          headerAlign: 'center',
          align: 'center',
        },

        {
          field: 'name',
          headerName: 'Nombre',
          type: 'number',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: (item) => {
            return (
              <Tooltip title={item.row?.name}>
                <Typography
                  style={{
                    maxWidth: '260px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.row.name}
                </Typography>
              </Tooltip>
            );
          },
        },
        {
          field: 'cost',
          headerName: 'Costo',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: (params) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="description">
                {`Q${params.row?.unit_price}`}
              </Typography>
            </div>
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
                tooltip={{ title: 'Editar registro' }}
                onClick={() => {
                  setEdit(true);
                  setOpen(true);

                  let editObject = { ...params.row };

                  formikProducto.form.setValues({
                    ...editObject,
                  });
                }}
                children={<Edit color="" />}
                can={{
                  key: `can-edit-prodmedic-${params.row.id}`,
                  I: Actions.EDIT,
                  a: Subjects.PRODUCTO,
                }}
              />
              <ApsIconButton
                tooltip={{ title: 'Eliminar producto' }}
                onClick={() => {
                  setOpenModalDelete(true);
                  setProductoToDelete(params.row);
                }}
                children={<Delete color="error" />}
                can={{
                  key: 'can-delete-prodmedic',
                  I: Actions.DELETE,
                  a: Subjects.PRODUCTO,
                }}
              />
            </>
          ),
        },
      ]
    : [
        {
          field: 'photo',
          headerName: 'Producto',
          type: 'img',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: (item) => {
            return (
              <>
                <Avatar
                  sx={{
                    marginBottom: {
                      xs: '8px !important',
                      md: '12px !important',
                      cursor: 'pointer',
                    },
                  }}
                  color={'secondary'}
                  src={item?.row?.photo}
                  onClick={() => {
                    if (item?.row?.photo) {
                      setCurrentImage(item?.row?.photo);
                      setOpenViewer(true);
                    }
                  }}
                >
                  <PersonIcon color={'primary'} fontSize="large" />
                </Avatar>
                {openViewer && currentImage === item?.row?.photo && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <ImageViewer
                      open={openViewer}
                      onClose={() => {
                        setOpenViewer(false);
                        setCurrentImage(null);
                      }}
                      images={[{ src: currentImage, alt: 'Product image' }]}
                    />
                  </div>
                )}
              </>
            );
          },
        },
        {
          field: 'id',
          headerName: 'Codigo',
          maxWidth: 100,
          headerAlign: 'center',
          align: 'center',
        },

        {
          field: 'name',
          headerName: 'Nombre',
          type: 'number',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: (item) => {
            return (
              <Tooltip title={item.row?.name}>
                <Typography
                  style={{
                    maxWidth: '260px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.row.name}
                </Typography>
              </Tooltip>
            );
          },
        },
        {
          field: 'cost',
          headerName: 'Costo',
          headerAlign: 'left',
          align: 'left',
          flex: 1,
          renderCell: (params) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="description">
                {`Precio: Q${params.row?.unit_price}`}
              </Typography>
            </div>
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
                tooltip={{ title: 'Editar registro' }}
                onClick={() => {
                  setEdit(true);
                  setOpen(true);
                  let editObject = { ...params.row };

                  formikProducto.form.setValues({
                    ...editObject,
                  });
                }}
                children={<Edit color="" />}
                can={{
                  key: `can-edit-prodmedic-${params.row.id}`,
                  I: Actions.EDIT,
                  a: Subjects.PRODUCTO,
                }}
              />
              <ApsIconButton
                tooltip={{ title: 'Eliminar producto' }}
                onClick={() => {
                  setOpenModalDelete(true);
                  setProductoToDelete(params.row);
                }}
                children={<Delete color="error" />}
                can={{
                  key: 'can-delete-prodmedic',
                  I: Actions.DELETE,
                  a: Subjects.PRODUCTO,
                }}
              />
            </>
          ),
        },
      ];

  const propsSearchBarButton = {
    label: 'Buscar por producto / Código de barras',
    onChange: (value) => setText(value),
    searchList: tabProductosList,
    searchKey: 'name',
    searchResults: (results) => setSearchList(results),
    rightButton: {
      icon: 'add_circle',
      onClick: () => setOpen(true),
      color: 'primary',
      can: {
        key: 'can-create-venta',
        I: Actions.CREATE,
        a: Subjects.PRODUCTO,
      },
    },
  };

  const propsModalDelete = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar producto',
    content: (
      <Typography>{`Está seguro que desea eliminar el producto "${productoToDelete?.name} " de forma permanente?`}</Typography>
    ),
    handleOk: () => handleDelete(),
    titleOk: 'Eliminar',
    handleCancel: () => handleCloseDelete(),
    titleCancel: 'Cancelar',
    okProps: {
      color: 'error',
      endIcon: <Delete />,
      disabled: loading,
    },
  };

  return {
    registrosListMedicamentos: tabProductosList,
    propsSearchBarButtonMedicamentos: propsSearchBarButton,
    columnsMedicamentos: columns,
    propsModalRegistroProducto,
    propsModalDelete,
    loading,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
    paginationModel,
    setPaginationModel,
    totalItems,
    propsModalRegistroProvider,
    propsModalRegistroCategory,
    propsModalRegistroProductMeasureType,
    searchList,
  };
};

export default useTabProductosMedicamentos;
