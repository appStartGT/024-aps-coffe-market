import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth, useFormikFields } from '@hooks';
import { fieldValidations } from '@utils';
import {
  salesCreateAction,
  setSaleModalAcation,
} from '../../../../store/modules/sales';

const useFormSales = () => {
  /* Hooks */
  const auth = useAuth();
  const dispatch = useDispatch();
  /* States */
  /* Selectors */
  const productInventoryList = useSelector(
    (state) => state.productInventory.productInventoryList
  );
  const isSaleModalOpen = useSelector((state) => state.sales.isSaleModalOpen);
  const processing = useSelector((state) => state.sales.processing);
  const [searchList, setSearchList] = useState();
  const [checkedItems, setCheckedItems] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const formik = useFormikFields({
    fields: [
      {
        id: '1',
        label: 'Nombre',
        name: 'names',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '2',
        label: 'Apellidos',
        name: 'surNames',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.required,
      },
      {
        id: '3',
        label: 'Dirección',
        name: 'address',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
      },
      {
        id: '4',
        label: 'Nit',
        name: 'NIT',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 20 },
        // InputProps: {
        //   endAdornment: (
        //     <InputAdornment position="end">
        //       <RecentActors />
        //     </InputAdornment>
        //   ),
        // },
      },
      {
        id: '106',
        label: 'Correo',
        name: 'email',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 200 },
        validations: fieldValidations.email,
      },
      {
        id: '107',
        label: 'Teléfono',
        name: 'phone',
        gridItem: true,
        gridProps: { md: 6 },
        inputProps: { maxLength: 20 },
        validations: fieldValidations.telephone,
      },
      // {
      //   id: '5',
      //   label: 'Descripción',
      //   name: 'description',
      //   gridItem: true,
      //   gridProps: { md: 12 },
      //   inputProps: { maxLength: 300 },
      //   validations: fieldValidations.description,
      // },
    ],
  });

  const handleRemoveItem = (itemName) => {
    setCheckedItems(
      checkedItems.filter((checkedItem) => checkedItem !== itemName)
    );
    const newQuantityInputs = { ...quantityInputs };
    delete newQuantityInputs[itemName];
    setQuantityInputs(newQuantityInputs);
  };

  const propsSearchBarButton = {
    label: 'Buscar producto',
    type: 'text',
    searchList: productInventoryList,
    searchKey: 'name',
    searchResults: (results) => setSearchList(results),
    onChange: (value) => setSearchList(value),
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleConfirm = () => {
    dispatch(
      salesCreateAction({
        ...formik.form.values,
        detail: checkedItems,
        id_organization: auth.user?.id_organization,
        id_branch: auth.user?.id_branch,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(setSaleModalAcation(false));
        setCheckedItems([]);
        setActiveStep(0);
        setSearchList(null);
        setQuantityInputs({});
      });
  };

  const handleOpen = (open) => {
    dispatch(setSaleModalAcation(open));
  };

  return {
    activeStep,
    checkedItems,
    formik,
    handleBack,
    handleConfirm,
    handleNext,
    handleOpen,
    handleRemoveItem,
    isSaleModalOpen,
    processing,
    productInventoryList,
    propsSearchBarButton,
    quantityInputs,
    searchList,
    setCheckedItems,
    setQuantityInputs,
  };
};

export default useFormSales;
