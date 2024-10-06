import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { purchaseDetailDto } from '@dto';
import {
  cleanModel,
  firebaseCollections,
  firebaseCollectionsKey,
  firebaseFilterBuilder,
} from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getDataFrom,
  deleteRecordById,
  insertInto,
  updateRecordBy,
} from '@utils/firebaseMethods';

export const purchaseDetailListAction = createAsyncThunk(
  'purchaseDetail/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(cleanModel(params, { allowNulls: true }));
    console.log(filterBy);
    return await getDataFrom({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      filterBy,
      nonReferenceField: firebaseCollectionsKey.purchase_detail,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseDetailCreateAction = createAsyncThunk(
  'purchaseDetail/create',
  async (data, { rejectWithValue, dispatch }) => {
    let body = cleanModel(data);
    body.isPriceless = Boolean(data.isPriceless);
    const purchaseDetailData = {
      key: firebaseCollectionsKey.purchase_detail,
      ...body,
    };

    return await insertInto({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      data: purchaseDetailData,
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      })
      .catch((res) => {
        return rejectWithValue(res);
      });
  }
);

export const purchaseDetailGetOneAction = createAsyncThunk(
  'purchaseDetail/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getDataFrom({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      docId: id,
      nonReferenceField: firebaseCollectionsKey.purchase_detail,
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

export const getOneAllDetallePurchaseDetailAction = createAsyncThunk(
  'purchaseDetail/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      nonReferenceField: firebaseCollectionsKey.purchase_detail,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseDetailUpdateAction = createAsyncThunk(
  'purchaseDetail/update',
  async (data, { rejectWithValue }) => {
    const body = purchaseDetailDto.purchaseDetailPut(data);
    return await updateRecordBy({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      data: body,
      filterBy: [
        {
          field: firebaseCollectionsKey.purchase_detail,
          condition: '==',
          value: data[firebaseCollectionsKey.purchase_detail],
        },
      ],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseDetailDeleteAction = createAsyncThunk(
  'purchaseDetail/delete',
  async ({ id_purchaseDetail }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      filterBy: [
        {
          field: firebaseCollectionsKey.purchase_detail,
          condition: '==',
          value: id_purchaseDetail,
        },
      ],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  purchaseDetailSelected: null,
  processing: false,
  purchaseDetailList: [],
  totalItems: 5,
};

export const purchaseDetailSlice = createSlice({
  name: 'purchaseDetail',
  initialState,
  reducers: {
    clearPurchaseDetailSelected: (state) => {
      state.purchaseDetailSelected = null;
    },
    setNewGeneralTotal: (state, payload) => {
      state.purchaseDetailSelected.total = payload.payload;
    },
    setPurchaseDetail: (state, action) => {
      state.purchaseDetailSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* LIST */
    builder.addCase(purchaseDetailListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseDetailListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(
      purchaseDetailListAction.fulfilled,
      (state, { payload }) => {
        state.purchaseDetailList = purchaseDetailDto.purchaseDetailList(
          payload.data
        );
        state.totalItems = payload.data.totalItems;
        state.processing = false;
      }
    );

    /* CREATE */
    builder.addCase(purchaseDetailCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      purchaseDetailCreateAction.rejected,
      (state, { payload }) => {
        console.error(payload);
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      purchaseDetailCreateAction.fulfilled,
      (state, { payload }) => {
        const purchaseDetail = purchaseDetailDto.purchaseDetailGetOne(payload);
        state.purchaseDetailSelected = purchaseDetail;
        state.purchaseDetailList = [
          ...state.purchaseDetailList,
          purchaseDetail,
        ];
        state.processing = false;
      }
    );

    /* GET ONE */
    builder.addCase(purchaseDetailGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      purchaseDetailGetOneAction.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      purchaseDetailGetOneAction.fulfilled,
      (state, { payload }) => {
        const selectedPurchaseDetail =
          purchaseDetailDto.purchaseDetailGetOne(payload);
        state.purchaseDetailSelected = selectedPurchaseDetail;
        state.processing = false;
      }
    );

    /* UPDATE */
    builder.addCase(purchaseDetailUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseDetailUpdateAction.rejected, (state, action) => {
      console.error(action);
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(
      purchaseDetailUpdateAction.fulfilled,
      (state, { payload }) => {
        const updatedPurchaseDetail =
          purchaseDetailDto.purchaseDetailGetOne(payload);
        state.purchaseDetailSelected = updatedPurchaseDetail;
        state.purchaseDetailList = purchaseDetailDto.updateListPurchaseDetail(
          state.purchaseDetailList,
          payload
        );
        state.processing = false;
      }
    );

    /* DELETE */
    builder.addCase(purchaseDetailDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseDetailDeleteAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(
      purchaseDetailDeleteAction.fulfilled,
      (state, { payload }) => {
        const id_purchaseDetail = payload.ids[0];
        state.purchaseDetailList = state.purchaseDetailList.filter(
          (purchaseDetail) =>
            purchaseDetail[firebaseCollectionsKey.purchase_detail] !==
            id_purchaseDetail
        );
        state.processing = false;
      }
    );
  },
});

export const { clearPurchaseDetailSelected, setPurchaseDetail } =
  purchaseDetailSlice.actions;

export default purchaseDetailSlice.reducer;
