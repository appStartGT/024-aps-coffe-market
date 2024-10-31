import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerDto } from '@dto';
import { cleanModel, firebaseCollections, firebaseFilterBuilder } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getAllDocuments,
  deleteRecordById,
  insertDocument,
  updateRecordBy,
} from '@utils/firebaseMethods';

export const customerListAction = createAsyncThunk(
  'customer/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(cleanModel(params));
    return await getAllDocuments({
      collectionName: firebaseCollections.CUSTOMER,
      filterBy,
      nonReferenceField: 'id_customer',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const customerCreateAction = createAsyncThunk(
  'customer/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);
    const customerData = {
      key: 'id_customer',
      ...body,
    };

    return await insertDocument({
      collectionName: firebaseCollections.CUSTOMER,
      data: customerData,
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      })
      .catch((res) => {
        dispatch(setLoadingMainViewAction(false));
        return rejectWithValue(res);
      });
  }
);

export const customerGetOneAction = createAsyncThunk(
  'customer/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getAllDocuments({
      collectionName: firebaseCollections.CUSTOMER,
      docId: id,
      nonReferenceField: 'id_customer',
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      })
      .catch((res) => {
        dispatch(setLoadingMainViewAction(false));
        return rejectWithValue(res);
      });
  }
);

export const getOneAllDetalleCustomerAction = createAsyncThunk(
  'customer/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getAllDocuments({
      collectionName: firebaseCollections.CUSTOMER,
      nonReferenceField: 'id_customer',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const customerUpdateAction = createAsyncThunk(
  'customer/update',
  async (data, { rejectWithValue }) => {
    let body = customerDto.customerPut(data);

    const customerData = {
      ...body,
    };

    return await updateRecordBy({
      collectionName: firebaseCollections.CUSTOMER,
      filterBy: [
        {
          field: 'id_customer',
          condition: '==',
          value: customerData.id_customer,
        },
      ],
      data: customerData,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const customerDeleteAction = createAsyncThunk(
  'customer/delete',
  async ({ id_customer }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.CUSTOMER,
      filterBy: [{ field: 'id_customer', condition: '==', value: id_customer }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  customerSelected: null,
  processing: false,
  customerList: [],
  totalItems: 5,
  customerPaymentSelected: [],
  totalPayments: 5,
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearCustomerSelected: (state) => {
      state.customerSelected = null;
    },
    clearCustomerPaymentSelected: (state) => {
      state.customerPaymentSelected = [];
    },
    setNewGeneralTotal: (state, payload) => {
      state.customerSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(customerListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(customerListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(customerListAction.fulfilled, (state, { payload }) => {
      state.customerList = customerDto.customerList(payload.data);
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(customerCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(customerCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(customerCreateAction.fulfilled, (state, { payload }) => {
      const customer = customerDto.customerGetOne(payload);
      state.customerSelected = customer;
      state.processing = false;
    });
    /* GET ONE */
    builder.addCase(customerGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(customerGetOneAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(customerGetOneAction.fulfilled, (state, { payload }) => {
      const customerSelected = customerDto.customerGetOne(payload);
      state.customerSelected = customerSelected;
      state.customerPaymentSelected = customerSelected.payments;

      state.processing = false;
    });

    /* SERVICIO UPDATE */
    builder.addCase(customerUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(customerUpdateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(customerUpdateAction.fulfilled, (state, { payload }) => {
      const updatedCustomer = customerDto.customerGetOne(payload);
      state.customerSelected = updatedCustomer;
      state.customerList = customerDto.updateListCustomer(
        state.customerList,
        payload
      );
      state.customerPaymentSelected = updatedCustomer.payments;
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(customerDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(customerDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(customerDeleteAction.fulfilled, (state, { payload }) => {
      const id_customer = payload.ids[0];
      state.customerList = state.customerList.filter(
        (customer) => customer.id !== id_customer
      );
      state.processing = false;
    });
  },
});

export const { clearCustomerSelected, clearCustomerPaymentSelected } =
  customerSlice.actions;

export default customerSlice.reducer;
