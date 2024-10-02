import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fieldValidations } from '@utils';
import * as yup from 'yup';
import { useFormikFields, useMountEffect } from '@hooks';
import { RecentActors, Save, Delete } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import ApsForm from '@components/ApsForm';
import {
  productsCreateAction,
  productstUpdateAction,
} from '../../../../store/modules/products';
import {
  providerCatalogAction,
  productMeasureTypeCatalogAction,
  categoryCatalogAction,
  insertproviderCatalogAction,
  insertCategoryCatalogAction,
  insertProductMeasureTypeCatalogAction,
  clearLastSelected,
} from '../../../../store/modules/catalogs/index';
import ApsFileUpload from '@components/ApsFileUpload';
import AutocompleteProduct from '../components/AutocompleteProduct';

const useRegistroProductoForm = ({
  loading,
  open,
  setOpen,
  id_organization,
  edit,
  setEdit,
}) => {
  const dispatch = useDispatch();
  const providerCatalog = useSelector((state) => state.catalogs.provider);
  const productMeasureTypeCatalog = useSelector(
    (state) => state.catalogs.productMeasureType
  );
  const categoryCatalog = useSelector((state) => state.catalogs.category);
  const lastCategory = useSelector((state) => state.catalogs.lastCategory);
  const lastProvider = useSelector((state) => state.catalogs.lastProvider);
  const lastMeasureType = useSelector(
    (state) => state.catalogs.lastMeasureType
  );
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [medidas, setMedidas] = useState(false);
  const [selectedMeasureName, setSelectedMeasureName] = useState('');
  const [openProvider, setOpenProvider] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openProductMeasure, setOpenProductMeasure] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [list, setList] = useState([]);

  const isComboValidation = (requiredText) =>
    yup.mixed().when('isCombo', {
      is: false,
      then: yup.mixed().required(requiredText),
      otherwise: yup.mixed(),
    });

  const useFormikCatalog = ({ label, additionalFields = [] }) => {
    const fields = [
      {
        id: '1',
        label: label,
        name: 'name',
        gridItem: true,
        gridProps: { md: additionalFields.length ? 6 : 12 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      ...additionalFields,
    ];

    return useFormikFields({
      fields,
    });
  };

  const formikProveedor = useFormikCatalog({
    label: 'Proveedor',
    additionalFields: [
      {
        id: '2',
        label: 'NIt',
        name: 'nit',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.number,
      },
      {
        id: '2',
        label: 'Telefono',
        name: 'phoneNumber',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.telephone,
      },
      {
        id: '15',
        label: 'Correo',
        name: 'email',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.email,
      },
      {
        id: '12',
        label: 'Direccion',
        name: 'address',
        value: '',
        gridItem: true,
        gridProps: { md: 12 },
        multiline: true,
        rows: 3,
      },
      {
        id: '13',
        label: 'Descripcion',
        name: 'description',
        value: '',
        gridItem: true,
        gridProps: { md: 12 },
        multiline: true,
        rows: 3,
        validations: fieldValidations.description,
      },
    ],
  });
  const formikCategory = useFormikCatalog({ label: 'Categoria' });
  const formikProductMeasureType = useFormikCatalog({ label: 'Presentacion' });
  const formikProducto = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre',
        name: 'name',
        gridItem: true,
        gridProps: { md: 4 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '3',
        label: 'Proveedor',
        name: 'provider',
        field: 'autocomplete',
        gridItem: true,
        gridProps: { md: 4 },
        options: providerCatalog,
        validations: isComboValidation('Debe agregar un proveedor'),
        noOptionsText: 'No hay opciones disponibles.',
        onAddNew: (inputValue) => {
          setOpenProvider(true);
          if (inputValue && inputValue.length > 0) {
            const formattedInputValue =
              inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

            formikProveedor.form.setValues({ name: formattedInputValue });
          } else {
            // Si no hay inputValue, establece el valor como vacío o maneja como necesites
            formikProveedor.form.setValues({ name: '' });
          }
        },
        renderfunction: () => !formikProducto.form.values?.isCombo,
      },
      {
        id: '4',
        label: 'Presentación',
        name: 'product_measure_type',
        field: 'autocomplete',
        gridItem: true,
        gridProps: { md: 4 },
        options: productMeasureTypeCatalog,
        validations: isComboValidation('Debe agregar una Presentacion'),
        noOptionsText: 'No hay opciones disponibles.',
        onAddNew: (inputValue) => {
          setOpenProductMeasure(true);

          if (inputValue && inputValue.length > 0) {
            const formattedInputValue =
              inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

            formikProductMeasureType.form.setValues({
              name: formattedInputValue,
            });
          } else {
            // Si no hay inputValue, establece el valor como vacío o maneja como necesites
            formikProductMeasureType.form.setValues({ name: '' });
          }
        },
        renderfunction: () => !formikProducto.form.values?.isCombo,
      },
      {
        id: '105',
        label: 'Categoria',
        name: 'category',
        field: 'autocomplete',
        gridItem: true,
        gridProps: { md: showHiddenFields ? 4 : 6 },
        inputProps: { maxLength: 200 },
        options: categoryCatalog,
        validations: isComboValidation('Debe agregar una categoria'),
        noOptionsText: 'No hay opciones disponibles.',
        onAddNew: (inputValue) => {
          setOpenCategory(true);
          if (inputValue && inputValue.length > 0) {
            const formattedInputValue =
              inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

            formikCategory.form.setValues({ name: formattedInputValue });
          } else {
            // Si no hay inputValue, establece el valor como vacío o maneja como necesites
            formikCategory.form.setValues({ name: '' });
          }
        },
        renderfunction: () => !formikProducto.form.values?.isCombo,
      },
      {
        id: '5',
        label: `Unidades ${selectedMeasureName ?? `${selectedMeasureName}`}`,
        name: 'units_per_measure',
        gridItem: true,
        gridProps: { md: 4 },
        inputProps: { maxLength: 20 },
        validations: yup
          .number()
          .typeError('Cantidad ingresada no válida')
          .positive('La cantidad debe ser un número positivo')
          .when(['product_measure_type', 'isCombo'], {
            is: (idProductMeasureType, isCombo) =>
              !isCombo &&
              (idProductMeasureType?.validation_id === 0 ||
                idProductMeasureType?.validation_id === undefined ||
                idProductMeasureType?.validation_id === null),
            then: yup
              .number()
              .typeError('Cantidad ingresada no válida')
              .required(
                `Por favor ingrese las unides para ${selectedMeasureName}`
              ),
            otherwise: yup.number(), // No required validation when isCombo is true
          }),
        renderfunction: () =>
          !formikProducto.form.values?.isCombo !== false
            ? showHiddenFields
              ? showHiddenFields
              : false
            : false,
        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <RecentActors />
            </InputAdornment>
          ),
        },
      },

      {
        id: '7',
        label: 'Costo',
        name: 'unit_price',
        gridItem: true,
        gridProps: { md: showHiddenFields ? 4 : medidas === false ? 6 : 4 },
        inputProps: { maxLength: 20 },
        validations: yup
          .number()
          .typeError('Cantidad ingresada no válida')
          .positive('La cantidad debe ser un número positivo')
          .required('Por favor ingrese el precio'),

        InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <RecentActors />
            </InputAdornment>
          ),
        },
        /*  renderfunction: () => showHiddenUnits, */
      },
      {
        id: '130',
        label: 'Codigo de barras',
        name: 'barcode',
        value: '',
        gridItem: true,
        gridProps: { md: 4 },
      },
      {
        id: '112',
        gridItem: true,
        field: 'custom',
        gridProps: { md: !medidas ? 8 : 12 },
        children: (
          <ApsFileUpload
            label="Sube tu foto del producto."
            accept="image/png,image/jpg,image/jpeg,image/gif"
            onChange={(file) => {
              formikProducto.form.setFieldValue('photo', file);
              setSelectedFile(file);
            }}
            value={selectedFile}
            maxSizeMB={5}
          />
        ),
      },
      {
        id: '12',
        label: 'Descripción del producto',
        name: 'description',
        value: '',
        gridItem: true,
        gridProps: { md: 12 },
        multiline: true,
        rows: 3,
        validations: fieldValidations.description,
      },
      {
        id: '13',
        label: 'isCombo',
        name: 'isCombo',
        value: false,
        gridItem: true,
        renderfunction: () => false,
      },
    ],
  });

  /* use Effects */
  useMountEffect({
    effect: () => {
      dispatch(providerCatalogAction({ id_organization }));
      dispatch(productMeasureTypeCatalogAction({ id_organization }));
      dispatch(categoryCatalogAction({ id_organization }));

      setSelectedFile({
        ...formikProducto.form.values?.photoMetadata,
        photo: formikProducto.form.values?.photo,
      });
    },
  });
  useEffect(() => {
    setSelectedFile({
      ...formikProducto.form.values?.photoMetadata,
      photo: formikProducto.form.values?.photo,
    });
    if (formikProducto.form.values?.isCombo) {
      setShowHiddenFields(true);
      setMedidas(true);
      setList(formikProducto.form.values.comboProducts);
    }
  }, [edit]);

  const getMeasureName = (id) => {
    const value = productMeasureTypeCatalog.find((item) => item.value == id);

    return value ? value.label : '';
  };
  /* Show hidden fields for measure type */
  useEffect(() => {
    const product_measure_type =
      formikProducto.form?.values?.product_measure_type?.validation_id;

    if (product_measure_type && product_measure_type === 1) {
      setShowHiddenFields(false);
      formikProducto.form.setValues({
        ...formikProducto.form?.values,
        units_per_measure: '',
      });
    } else {
      const optionName = getMeasureName(
        formikProducto.form?.values?.product_measure_type?.value
      );
      setSelectedMeasureName(optionName);
      setShowHiddenFields(true);
    }
  }, [formikProducto.form?.values?.product_measure_type, lastMeasureType]);

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
  }, [formikProducto.form?.values?.unit_price]);
  const propsModalRegistroProducto = {
    open: open,
    onClose: () => handleClose(),
    maxWidth: 'md',
    title: formikProducto?.form?.values?.id_product
      ? 'Editar producto'
      : 'Crear producto',
    description: formikProducto?.form?.values?.id_product
      ? 'Complete los campos requeridos para editar el producto.'
      : 'Complete los campos requeridos para crear el producto.',
    content: (
      <Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
          {!edit && (
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                  onChange={({ target }) => {
                    setList([]);
                    formikProducto.form.setValues({
                      ...formikProducto.form.values,
                      provider: '',
                      product_measure_type: '',
                      category: '',
                      units_per_measure: '',
                    });
                    formikProducto.form.setFieldValue(
                      'isCombo',
                      target.checked
                    );

                    setShowHiddenFields(!target.checked);
                    setMedidas(target.checked);
                  }}
                  checked={formikProducto.form.isCombo}
                />
              }
              label="Combo"
            />
          )}
        </Box>
        <ApsForm title="" formik={formikProducto} />

        {formikProducto.form?.values?.isCombo && (
          <>
            <div style={{ marginTop: '10px' }}>
              <AutocompleteProduct
                id_organization={id_organization}
                list={list}
                setList={setList}
              />
            </div>

            <div style={{ marginTop: '10px' }}>
              {list.length > 0 && (
                <List sx={{ padding: 0 }}>
                  {list.map((producto, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                      secondaryAction={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {/* Campo para la cantidad */}
                          <TextField
                            type="number"
                            value={producto.quantity || 1}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value, 10);
                              setList((prevList) =>
                                prevList.map((item, i) =>
                                  i === index
                                    ? { ...item, quantity: newQuantity }
                                    : item
                                )
                              );
                            }}
                            inputProps={{ min: 1 }}
                            sx={{ width: '80px', marginRight: '10px' }}
                          />

                          <IconButton
                            onClick={() => {
                              setList(list.filter((item, i) => i !== index));
                            }}
                            sx={{
                              color: 'red', // Cambia el color del ícono a rojo
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={producto?.photo}
                          alt={producto.name}
                          sx={{ marginRight: '10px' }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${producto.name}  - Q.${
                          producto.unit_price
                        } - Unidades: ${producto.units_per_measure || 1} `}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          </>
        )}
      </Box>
    ),
    handleOk: () => handleOnclick(),
    titleOk: formikProducto?.form?.values?.id_product
      ? 'Editar'
      : 'Crear producto',
    handleCancel: () => handleClose(),
    titleCancel: 'Cancelar',
    okProps: {
      disabled:
        !formikProducto.form.isValid ||
        loading ||
        formikProducto.form?.values?.isCombo
          ? !(formikProducto.form?.values?.isCombo && list?.length)
          : false,
      endIcon: <Save />,
    },
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setSelectedFile(null);
    formikProducto.clearForm();
    setList([]);
    setShowHiddenFields(false);
    setMedidas(false);
    dispatch(clearLastSelected());
  };

  const handleOnclick = () => {
    if (formikProducto?.form?.values?.id_product) {
      const newList =
        list?.map((producto) => {
          return {
            id: producto.id,
            id_product: producto.id_product,
            name: producto.name,
            photo: producto.photo,
            quantity: producto.quantity || 1,
          };
        }) || [];
      dispatch(
        productstUpdateAction({
          ...formikProducto.form.values,
          comboProducts: newList,
        })
      ).then(() => {
        handleClose();
      });
    } else {
      const newList =
        list?.map((producto) => {
          return {
            id: producto.id,
            id_product: producto.id_product,
            name: producto.name,
            photo: producto.photo,
            quantity: producto.quantity || 1,
            unit_price: producto.unit_price,
            units_per_measure: producto.units_per_measure || 1,
          };
        }) || [];
      dispatch(
        productsCreateAction({
          ...formikProducto.form.values,
          id_organization: id_organization,
          comboProducts: newList,
        })
      ).then(() => {
        handleClose();
      });
    }
  };

  // Función para crear las propiedades del modal de forma genérica
  const createModalProps = (
    open,
    setOpen,
    formik,
    dispatchAction,
    title,
    description,
    saveTitle
  ) => {
    const handleClose = () => {
      setOpen(false);
      formik.clearForm();
    };

    const handleSave = () => {
      dispatch(dispatchAction({ ...formik.form.values, id_organization }));
      handleClose();
    };

    return {
      open,
      onClose: handleClose,
      maxWidth: 'md',
      title,
      description,
      content: <ApsForm title="" formik={formik} />,
      handleOk: handleSave,
      titleOk: saveTitle,
      handleCancel: handleClose,
      titleCancel: 'Cancelar',
      okProps: {
        disabled: !formik.form.isValid || loading,
        endIcon: <Save />,
      },
    };
  };

  // Usar la función para crear las propiedades de cada modal
  const propsModalRegistroProvider = createModalProps(
    openProvider,
    setOpenProvider,
    formikProveedor,
    insertproviderCatalogAction,
    'Nuevo Proveedor',
    'Complete los campos requeridos para crear el proveedor.',
    'Crear Proveedor'
  );
  const propsModalRegistroCategory = createModalProps(
    openCategory,
    setOpenCategory,
    formikCategory,
    insertCategoryCatalogAction,
    'Nueva Categoria',
    'Complete los campos requeridos para crear la Categoria.',
    'Crear Categoria'
  );
  const propsModalRegistroProductMeasureType = createModalProps(
    openProductMeasure,
    setOpenProductMeasure,
    formikProductMeasureType,
    insertProductMeasureTypeCatalogAction,
    'Nueva Presentacion',
    'Complete los campos requeridos para crear la Presentacion.',
    'Crear Presentacion'
  );

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS

    if (formikProducto?.form) {
      formikProducto.form.setValues({
        ...formikProducto.form.values,
        category: lastCategory,
      });
    }
  }, [lastCategory]);

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS

    if (formikProducto?.form) {
      formikProducto.form.setValues({
        ...formikProducto.form.values,
        provider: lastProvider,
      });
    }
  }, [lastProvider]);

  useEffect(() => {
    //UNMOUNT COMPONENT ACTIONS
    if (formikProducto?.form) {
      formikProducto.form.setValues({
        ...formikProducto.form.values,
        product_measure_type: lastMeasureType,
      });
    }
  }, [lastMeasureType]);

  return {
    propsModalRegistroProducto,
    formikProducto,
    propsModalRegistroProvider,
    propsModalRegistroCategory,
    propsModalRegistroProductMeasureType,
  };
};

export default useRegistroProductoForm;
