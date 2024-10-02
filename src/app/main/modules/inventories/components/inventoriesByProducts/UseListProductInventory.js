import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Delete, Edit, Save } from '@mui/icons-material';
import ApsIconButton from '@components/ApsIconButton';
import {
  Avatar,
  Chip,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useAuth, useFormikFields, useMountEffect } from '@hooks';
import { useSelector } from 'react-redux';
import {
  // Restore as RestoreIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import moment from 'moment';

import ImageViewer from '@components/ImageViewer';
import { getStockStatusColor } from '@utils';
import StepperInventory from './StepperInventory';
import {
  inventoryBranchListAction,
  inventoryBranchDeleteAction,
  inventoryBranchUpdateAction,
} from '../../../../../store/modules/productInventory';
import { useParams } from 'react-router-dom';
import ApsForm from '@components/ApsForm';
import * as yup from 'yup';
import { fieldValidations } from '@utils';

const useTabListInventoryProduct = () => {
  const [openViewer, setOpenViewer] = useState(false);
  const auth = useAuth();
  const [currentImage, setCurrentImage] = useState(null);

  const dispatch = useDispatch();
  const theme = useTheme();
  /* states */
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openStepper, setOpenStepper] = useState(false);
  const [, setText] = useState('');

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 1,
  });
  const [pageSize, setPageSize] = useState(5);
  const loading = useSelector(
    (state) => state.productInventory.processingProductList
  );
  const productInventoryList = useSelector(
    (state) => state.productInventory.productInventoryList
  );
  const processing = useSelector((state) => state.productInventory.processing);

  const totalItems = useSelector(
    (state) => state?.productInventory?.totalItemsInventario
  );
  const [searchList, setSearchList] = useState(null);

  const { propsModalStep } = StepperInventory({
    loading,
    openStepper,
    setOpenStepper,
    id_organization: auth.user?.id_organization,
    id_branch: auth.user?.id_branch,
  });
  const { id_branch, id_inventory } = useParams();
  /* Use Effects */
  useMountEffect({
    effect: () => {
      let params = { id_inventory };

      !productInventoryList.length &&
        dispatch(inventoryBranchListAction(params));
    },
    /*     deps: [id_inventory], */
  });

  const columns = [
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
      field: 'price',
      headerName: 'Precio',
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
            {`Precio: Q${params.row?.sale_price}`}
          </Typography>
        </div>
      ),
    },

    {
      field: 'quantity',
      headerName: 'Cantidad',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => (
        <>
          {!params.row.isCombo ? (
            <>
              <Chip
                variant="outlined"
                label={`${params.row.quantity} ${params.row.id_product_measure_type?.label}`}
                style={{
                  margin: '12px',
                  color: getStockStatusColor(params.row.quantity, theme),
                  borderColor: getStockStatusColor(params.row.quantity, theme),
                }}
              />
            </>
          ) : (
            <Chip
              variant="outlined"
              label={`Combo`}
              style={{
                margin: '12px',
                color: 'orange',
                borderColor: 'orange',
              }}
            />
          )}
        </>
      ),
    },

    {
      field: 'expireAtFormated',
      headerName: 'Vence',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        const theme = useTheme();
        let colorStyle = ''; // Sin color inicialmente para fechas no relevantes
        let valor = 'Sin Vencer'; // Valor por defecto si no hay fecha

        if (params.row && params.row.expireAt) {
          const today = moment();
          const expireDate = moment(params.row.expireAt, 'YYYY-MM-DD');

          if (!expireDate.isValid()) {
            valor = 'Fecha inválida'; // Manejo del caso donde la fecha es inválida
          } else {
            valor = expireDate.format('DD/MM/YYYY'); // Formatear la fecha para mostrar
            // Determinar el estilo basado en la fecha de expiración
            if (expireDate.isSame(today, 'day')) {
              // Si la fecha es igual a la fecha actual
              colorStyle = theme.palette.error.main;
            } else if (expireDate.isBefore(today, 'day')) {
              // Si la fecha es menor que la fecha actual
              colorStyle = theme.palette.error.main;
            } else if (
              expireDate.diff(today, 'months') <= 3 &&
              expireDate.isAfter(today)
            ) {
              // Si la fecha está dentro de los próximos 3 meses
              colorStyle = theme.palette.warning.main;
            }
          }
        }

        return (
          <Typography
            variant="body2"
            style={{
              color: colorStyle,
              fontWeight: colorStyle ? '600' : 'normal',
            }}
          >
            {valor}
          </Typography>
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
          {!params.row.isCombo && (
            <ApsIconButton
              tooltip={{ title: 'Editar registro' }}
              onClick={() => {
                setOpenEdit(true);
                let editObject = { ...params.row };

                formikProducto.form.setValues({
                  ...editObject,
                  cantidadActual: params.row.quantity,
                  unit_price: editObject?.product.unit_price,
                });
              }}
              children={<Edit color="" />}
            />
          )}

          <ApsIconButton
            tooltip={{ title: 'Eliminar producto' }}
            onClick={() => {
              setOpenModalDelete(true);
              setProductoToDelete(params.row);
            }}
            children={<Delete color="error" />}
            /*  can={{
              key: 'can-delete-prodmedic',
              I: Actions.DELETE,
              a: Subjects.PRODUCTO,
            }} */
          />
        </>
      ),
    },
  ];

  const [valueCheck, setValueCheck] = useState(false);
  const [, setValidateCheck] = useState(false);

  const formikProducto = useFormikFields({
    fields: [
      {
        id: '78',
        label: 'Costo',
        name: 'unit_price',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 6 },
        validations: fieldValidations.numberInger({ required: true }),
        /*  InputProps: {
          endAdornment: <InputAdornment position="end"></InputAdornment>,
        }, */
        disabled: true,
      },
      {
        id: '18',
        label: `Porcentaje`,
        name: 'percent',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 20 },
        value: 0,
        validations: yup
          .number()
          .typeError('Cantidad ingresada no válida')
          // .required('Por favor ingrese el porcentaje')
          .min(0, 'El porcentaje no puede ser menor que 0')
          .max(100, 'El porcentaje no puede ser mayor que 100'),
        InputProps: {
          endAdornment: <InputAdornment position="end"></InputAdornment>,
        },
        /* renderfunction: () => showHiddenUnits, */
      },
      {
        id: '8',
        label: `Precio venta`,
        name: 'sale_price',
        gridItem: true,
        gridProps: { md: 6 },
        // inputProps: { maxLength: 20 },
        validations: yup
          .number()
          .typeError('Cantidad ingresada no válida')
          .positive('La cantidad debe ser un número positivo')
          .required('Por favor ingrese el precio'),
        InputProps: {
          endAdornment: <InputAdornment position="end"></InputAdornment>,
        },
        /* renderfunction: () => showHiddenUnits, */
      },
      {
        id: '84',
        label: `Precio mayorista`,
        name: 'mayor_sale_price',
        gridItem: true,
        gridProps: { md: 6 },
        // inputProps: { maxLength: 20 },
        validations: yup.number(),
        InputProps: {
          endAdornment: <InputAdornment position="end"></InputAdornment>,
        },
        /* renderfunction: () => showHiddenUnits, */
      },
      {
        id: '9',
        label: 'Fecha de vencimiento',
        name: 'expireAt',
        gridItem: true,
        gridProps: { md: 6 },
        field: 'datePicker',

        validations: fieldValidations.dateValidation({
          min: moment(),
          max: '2100-01-01',
          // required: true,
        }),
      },
      {
        id: '11',
        label: 'Cantidad',
        name: 'quantity',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 6 },
        validations: fieldValidations.numberInger({ required: true }),
        InputProps: {
          endAdornment: <InputAdornment position="end"></InputAdornment>,
        },
        disabled: true,
      },
      /* {
        id: '12',
        label: 'Descripción del producto',
        name: 'description',
        value: '',
        gridItem: true,
        gridProps: { md: 12 },
        multiline: true,
        rows: 3,
        validations: fieldValidations.description,
      }, */

      {
        id: '46',
        label: 'Refill',
        name: 'refill',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 6 },
        validations: fieldValidations.numberInger({ required: false }),
        InputProps: {
          endAdornment: <InputAdornment position="end"></InputAdornment>,
        },
      },
      {
        id: '47',
        gridItem: true,
        field: 'custom',
        gridProps: { md: 6 },
        children: (
          <div
            style={{
              width: '100%',
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}
          >
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <RadioGroup
                row
                aria-label="refillAction"
                name="refillAction"
                value={valueCheck}
                onChange={(event) => {
                  setValueCheck(event.target.value);
                  formikProducto.form.setFieldValue(
                    'refillAction',
                    event.target.value
                  );
                  setValidateCheck(true);
                }}
              >
                <FormControlLabel
                  value="Añadir"
                  control={<Radio />}
                  label="Añadir"
                />
                <FormControlLabel
                  value="Establecer"
                  control={<Radio />}
                  label="Establecer"
                />
              </RadioGroup>
            </FormControl>
          </div>
        ),
      },
    ],
  });

  useEffect(() => {
    if (formikProducto.form?.values?.percent > 0) {
      const cost = formikProducto.form?.values?.unit_price
        ? formikProducto.form?.values?.unit_price
        : 0;
      const price =
        Number(cost) * (1 + Number(formikProducto.form?.values?.percent) / 100);

      formikProducto.form.setValues({
        ...formikProducto.form?.values,
        sale_price: price.toFixed(2),
      });
    } else {
      formikProducto.form.setValues({
        ...formikProducto.form?.values,
        sale_price: formikProducto.form?.values?.unit_price,
      });
    }
  }, [formikProducto.form?.values?.percent]);

  const propsModalEdit = {
    open: openEdit,
    onClose: () => handleClose(),
    maxWidth: 'sm',
    title: 'Editar producto',
    description: 'Complete los campos requeridos para editar el producto.',

    content: <ApsForm title="" formik={formikProducto} />,
    handleOk: () => handleOnclick(),
    titleOk: 'Editar',
    handleCancel: () => handleClose(),
    titleCancel: 'Cancelar',
    okProps: {
      disabled: !formikProducto.form.isValid || processing,
      endIcon: <Save />,
    },
  };

  const propsSearchBarButton = {
    label: 'Buscar por producto / Código de barras',
    onChange: (value) => setText(value),
    searchList: productInventoryList,
    searchKey: 'name',
    searchResults: (results) => setSearchList(results),
    rightButton: {
      icon: 'add_circle',
      onClick: () => {
        setOpenStepper(true);
      },
      color: 'primary',
    },
  };

  const propsModalDelete = {
    open: openModalDelete,
    onClose: () => handleCloseDelete(),
    title: 'Eliminar producto',
    content: (
      <Typography>{`Está seguro que desea eliminar el producto del inventario "${productoToDelete?.name} " de forma permanente?`}</Typography>
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

  const handleDelete = () => {
    dispatch(
      inventoryBranchDeleteAction({
        id_inventory_branch: productoToDelete.id,
      })
    );
    handleCloseDelete();
  };

  const handleClose = () => {
    setOpenEdit(false);
    setValueCheck(null);
    setValidateCheck(false);
  };

  const handleOnclick = () => {
    let orders;
    let dataEnviar = {};
    if (
      formikProducto.form.values.refill > 0 &&
      formikProducto.form.values.refillAction
    ) {
      orders = {
        quantity: formikProducto.form.values.refill,
        unit_price: formikProducto.form.values.product.unit_price,
        id_product: formikProducto.form.values.id_product,
        id_provider: formikProducto.form.values.product.id_provider,
        id_organization: formikProducto.form.values.product.id_organization,
        id_branch: id_branch,
        id_inventory: id_inventory,
        refillAction: formikProducto.form.values.refillAction || '',
        lastQuantity: formikProducto.form.values.quantity,
        mayor_sale_price: formikProducto.form.values.mayor_sale_price || 0,
      };
      dataEnviar = { ...dataEnviar, orders };
    }

    let cantidad = { quantity: formikProducto.form.values.quantity };
    if (
      formikProducto.form.values.refill > 0 &&
      formikProducto.form.values.refillAction
    ) {
      cantidad = {
        quantity:
          formikProducto.form.values.refillAction === 'Añadir'
            ? +formikProducto.form.values.quantity +
              +formikProducto.form.values.refill
            : formikProducto.form.values.refill,
      };
    }
    const inventoryProduct = {
      percent: formikProducto.form.values.percent || 0,
      sale_price: formikProducto.form.values.sale_price,
      expireAt: formikProducto.form.values.expireAt || null,
      id_inventory_branch: formikProducto.form.values.id_inventory_branch,
      mayor_sale_price: formikProducto.form.values.mayor_sale_price,
      ...cantidad,
    };

    dataEnviar = { ...dataEnviar, inventory: inventoryProduct };

    dispatch(inventoryBranchUpdateAction(dataEnviar)).then(() => {
      handleClose();
    });
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

  return {
    registrosListProductsInventory: productInventoryList,
    propsSearchBarButtonMedicamentos: propsSearchBarButton,
    columnsProductsInventory: columns,
    propsModalDelete,
    loading,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
    paginationModel,
    setPaginationModel,
    totalItems,
    searchList,
    propsModalStep,
    propsModalEdit,
  };
};

export default useTabListInventoryProduct;
