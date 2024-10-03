import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerDto, purchaseDto } from '@dto';
import { cleanModel, firebaseCollections, firebaseFilterBuilder } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getDataFrom,
  deleteRecordById,
  insertInto,
  updateRecordBy,
} from '@utils/firebaseMethods';
import { customerCreateAction, customerUpdateAction } from '../customer';

export const purchaseListAction = createAsyncThunk(
  'purchase/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(cleanModel(params));
    return await getDataFrom({
      collectionName: firebaseCollections.PURCHASE,
      filterBy,
      nonReferenceField: 'id_purchase',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseCreateAction = createAsyncThunk(
  'purchase/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);

    // Create customer first
    const customerData = {
      name: body.name,
      surNames: body.surNames,
      email: body.email,
      phone: body.phone,
      nit: body.nit,
      DPI: body.DPI,
      address: body.address,
    };

    const customerResponse = await dispatch(
      customerCreateAction(customerData)
    ).unwrap();
    const id_customer = customerResponse.id_customer;

    const purchaseData = {
      key: 'id_purchase',
      // ...body,
      id_customer,
    };

    return await insertInto({
      collectionName: firebaseCollections.PURCHASE,
      data: purchaseData,
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

export const purchaseGetOneAction = createAsyncThunk(
  'purchase/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getDataFrom({
      collectionName: firebaseCollections.PURCHASE,
      docId: id,
      nonReferenceField: 'id_purchase',
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

export const getOneAllDetallePurchaseAction = createAsyncThunk(
  'purchase/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: firebaseCollections.PURCHASE,
      nonReferenceField: 'id_purchase',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseUpdateAction = createAsyncThunk(
  'purchase/update',
  async (data, { dispatch }) => {
    await dispatch(customerUpdateAction(data)).unwrap();

    return {
      ...data,
    };
  }
);

export const purchaseDeleteAction = createAsyncThunk(
  'purchase/delete',
  async ({ id_purchase }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.PURCHASE,
      filterBy: [{ field: 'id_purchase', condition: '==', value: id_purchase }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  purchaseSelected: null,
  processing: false,
  purchaseList: [],
  totalItems: 5,
  purchasePaymentSelected: [],
  totalPayments: 5,
};

export const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    clearPurchaseSelected: (state) => {
      state.purchaseSelected = null;
    },
    clearPurchasePaymentSelected: (state) => {
      state.purchasePaymentSelected = [];
    },
    setNewGeneralTotal: (state, payload) => {
      state.purchaseSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(purchaseListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(purchaseListAction.fulfilled, (state, { payload }) => {
      state.purchaseList = purchaseDto.purchaseList(payload.data);
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(purchaseCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(purchaseCreateAction.fulfilled, (state, { payload }) => {
      const purchase = purchaseDto.purchaseGetOne(payload);
      state.purchaseSelected = purchase;
      state.processing = false;
    });
    /* GET ONE */
    builder.addCase(purchaseGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseGetOneAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(purchaseGetOneAction.fulfilled, (state, { payload }) => {
      const selectedPurchase = purchaseDto.purchaseGetOne(payload);
      state.purchaseSelected = selectedPurchase;
      state.purchasePaymentSelected = selectedPurchase.payments;

      state.processing = false;
    });

    /* SERVICIO UPDATE */
    builder.addCase(purchaseUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseUpdateAction.rejected, (state, action) => {
      console.error(action);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(purchaseUpdateAction.fulfilled, (state, { payload }) => {
      const updatedPurchase = purchaseDto.purchaseGetOne(payload);
      state.purchaseSelected = updatedPurchase;
      state.purchaseList = purchaseDto.updateListPurchase(
        state.purchaseList,
        payload
      );
      state.purchasePaymentSelected = updatedPurchase.payments;
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(purchaseDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(purchaseDeleteAction.fulfilled, (state, { payload }) => {
      const id_purchase = payload.ids[0];
      state.purchaseList = state.purchaseList.filter(
        (purchase) => purchase.id !== id_purchase
      );
      state.processing = false;
    });
  },
});

export const { clearPurchaseSelected, clearPurchasePaymentSelected } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;
