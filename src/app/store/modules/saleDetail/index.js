import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saleDetailDto } from '@dto';
import {
  cleanModel,
  firebaseCollections,
  firebaseCollectionsKey,
} from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getAllDocuments,
  deleteRecordById,
  insertDocument,
  updateRecordBy,
} from '@utils/firebaseMethods';
import { firestore, FieldValue } from '@config/firebaseConfig';
import { updateSaleListDetailsAction } from '../sale';

export const saleDetailListAction = createAsyncThunk(
  'saleDetail/list',
  async ({ id_sale }, { rejectWithValue, getState, dispatch }) => {
    const state = getState();
    const saleListDetails = state.sale.rowSaleDetails;

    if (saleListDetails && saleListDetails.length > 0) {
      const filteredDetails = saleListDetails.filter(
        (detail) => detail.id_sale === id_sale
      );
      if (filteredDetails.length > 0) {
        return { data: filteredDetails, totalItems: filteredDetails.length };
      }
    }

    return await getAllDocuments({
      collectionName: firebaseCollections.SALE_DETAIL,
      filterBy: [
        {
          field: 'id_sale',
          condition: '==',
          value: id_sale,
          reference: true,
        },
      ],
      excludeReferences: ['id_sale_detail_remate'],
    })
      .then((res) => {
        dispatch(updateSaleListDetailsAction(res.data));
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

export const saleDetailCreateAction = createAsyncThunk(
  'saleDetail/create',
  async (data, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    const id_budget = state.budget.budget.id_budget;
    let body = cleanModel({ ...data, isAveraged: false, id_budget });
    body.isPriceless = Boolean(data.isPriceless);
    const saleDetailData = {
      key: firebaseCollectionsKey.sale_detail,
      ...body,
    };

    return await insertDocument({
      collectionName: firebaseCollections.SALE_DETAIL,
      data: saleDetailData,
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        dispatch(updateSaleListDetailsAction([res]));
        return { ...res };
      })
      .catch((res) => {
        return rejectWithValue(res);
      });
  }
);

export const getOneAllDetalleSaleDetailAction = createAsyncThunk(
  'saleDetail/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getAllDocuments({
      collectionName: firebaseCollections.SALE_DETAIL,
      nonReferenceField: firebaseCollectionsKey.sale_detail,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const saleDetailUpdateAction = createAsyncThunk(
  'saleDetail/update',
  async (data, { rejectWithValue, dispatch }) => {
    const body = saleDetailDto.saleDetailPut(data);
    return await updateRecordBy({
      collectionName: firebaseCollections.SALE_DETAIL,
      data: body,
      filterBy: [
        {
          field: firebaseCollectionsKey.sale_detail,
          condition: '==',
          value: data[firebaseCollectionsKey.sale_detail],
        },
      ],
    })
      .then((res) => {
        dispatch(updateSaleListDetailsAction([res]));
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

export const saleDetailDeleteAction = createAsyncThunk(
  'saleDetail/delete',
  async ({ id_sale_detail }, { rejectWithValue, dispatch }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.SALE_DETAIL,
      filterBy: [
        {
          field: firebaseCollectionsKey.sale_detail,
          condition: '==',
          value: id_sale_detail,
        },
      ],
    })
      .then((res) => {
        dispatch(
          updateSaleListDetailsAction([{ id_sale_detail, deleted: true }])
        );
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  saleDetailSelected: null,
  processing: false,
  saleDetailList: [],
  saleDetailListPriceless: [],
  totalItems: 5,
};

export const saleDetailSlice = createSlice({
  name: 'saleDetail',
  initialState,
  reducers: {
    clearSaleDetailSelected: (state) => {
      state.saleDetailSelected = null;
    },
    setNewGeneralTotal: (state, payload) => {
      state.saleDetailSelected.total = payload.payload;
    },
    setSaleDetail: (state, action) => {
      state.saleDetailSelected = action.payload;
    },
    clearAllSaleDetails: (state) => {
      state.saleDetailList = [];
      state.saleDetailListPriceless = [];
    },
  },
  extraReducers: (builder) => {
    /* LIST */
    builder.addCase(saleDetailListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleDetailListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(saleDetailListAction.fulfilled, (state, { payload }) => {
      const allSaleDetails = saleDetailDto.saleDetailList(payload.data);
      state.saleDetailList = allSaleDetails.filter(
        (detail) => detail.isPriceless === false
      );
      state.saleDetailListPriceless = allSaleDetails.filter(
        (detail) => detail.isPriceless === true
      );
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /* CREATE */
    builder.addCase(saleDetailCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleDetailCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(saleDetailCreateAction.fulfilled, (state, { payload }) => {
      if (!payload.nonupdate) {
        const saleDetail = saleDetailDto.saleDetailGetOne(payload);
        state.saleDetailSelected = saleDetail;
        if (saleDetail.isPriceless) {
          state.saleDetailListPriceless = [
            ...state.saleDetailListPriceless,
            saleDetail,
          ];
        } else {
          state.saleDetailList = [...state.saleDetailList, saleDetail];
        }
      }
      state.processing = false;
    });

    /* UPDATE */
    builder.addCase(saleDetailUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleDetailUpdateAction.rejected, (state, action) => {
      console.error(action);
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(saleDetailUpdateAction.fulfilled, (state, { payload }) => {
      const updatedSaleDetail = saleDetailDto.saleDetailGetOne(payload);
      state.saleDetailSelected = updatedSaleDetail;

      // Remove the old record from both lists
      state.saleDetailList = state.saleDetailList.filter(
        (detail) =>
          detail[firebaseCollectionsKey.sale_detail] !==
          updatedSaleDetail[firebaseCollectionsKey.sale_detail]
      );
      state.saleDetailListPriceless = state.saleDetailListPriceless.filter(
        (detail) =>
          detail[firebaseCollectionsKey.sale_detail] !==
          updatedSaleDetail[firebaseCollectionsKey.sale_detail]
      );

      // Add the updated record to the correct list
      if (updatedSaleDetail.isPriceless) {
        state.saleDetailListPriceless.push(updatedSaleDetail);
      } else {
        state.saleDetailList.push(updatedSaleDetail);
      }

      state.processing = false;
    });

    /* DELETE */
    builder.addCase(saleDetailDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleDetailDeleteAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(saleDetailDeleteAction.fulfilled, (state, { payload }) => {
      const id_saleDetail = payload.ids[0];
      state.saleDetailList = state.saleDetailList.filter(
        (saleDetail) =>
          saleDetail[firebaseCollectionsKey.sale_detail] !== id_saleDetail
      );
      state.saleDetailListPriceless = state.saleDetailListPriceless.filter(
        (saleDetail) =>
          saleDetail[firebaseCollectionsKey.sale_detail] !== id_saleDetail
      );
      state.processing = false;
    });
  },
});

export const { clearSaleDetailSelected, setSaleDetail, clearAllSaleDetails } =
  saleDetailSlice.actions;

export default saleDetailSlice.reducer;
