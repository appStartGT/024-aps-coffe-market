import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { purchaseDetailDto } from '@dto';
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
import { updatePurchaseListDetailsAction } from '../purchase';

export const purchaseDetailListAction = createAsyncThunk(
  'purchaseDetail/list',
  async ({ id_purchase }, { rejectWithValue, getState, dispatch }) => {
    const state = getState();
    const purchase = state.purchase.purchaseSelected;
    const purchaseListDetails = state.purchase.rowPurchaseDetails;
    const id_budget = state.budget.budget.id_budget;
    if (purchaseListDetails && purchaseListDetails.length > 0) {
      const filteredDetails = purchaseListDetails.filter(
        (detail) => detail.id_purchase === id_purchase
      );
      if (filteredDetails.length > 0) {
        return {
          data: filteredDetails,
          totalItems: filteredDetails.length,
          purchaseSelected: purchase,
        };
      }
    }

    return await getAllDocuments({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      filterBy: [
        {
          field: 'id_purchase',
          condition: '==',
          value: id_purchase,
          reference: true,
        },
        {
          field: firebaseCollectionsKey.budget,
          condition: '==',
          value: id_budget,
          reference: true,
        },
      ],
      excludeReferences: ['id_purchase_detail_remate'],
    })
      .then((res) => {
        dispatch(updatePurchaseListDetailsAction(res.data));
        return { ...res, purchaseSelected: purchase };
      })
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseDetailCreateAction = createAsyncThunk(
  'purchaseDetail/create',
  async (data, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    const purchaseSelected = state.purchase.purchaseSelected;
    const id_budget = state.budget.budget.id_budget;
    let body = cleanModel({ ...data, isSold: false, id_budget });
    body.isPriceless = Boolean(data.isPriceless);
    const purchaseDetailData = {
      ...body,
    };

    return await insertDocument({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      data: purchaseDetailData,
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        dispatch(updatePurchaseListDetailsAction([res]));
        return { ...res, purchaseSelected };
      })
      .catch((res) => {
        return rejectWithValue(res);
      });
  }
);

export const getOneAllDetallePurchaseDetailAction = createAsyncThunk(
  'purchaseDetail/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getAllDocuments({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      nonReferenceField: firebaseCollectionsKey.purchase_detail,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseDetailUpdateAction = createAsyncThunk(
  'purchaseDetail/update',
  async (data, { rejectWithValue, dispatch }) => {
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
      .then((res) => {
        dispatch(updatePurchaseListDetailsAction([res]));
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

export const purchaseDetailDeleteAction = createAsyncThunk(
  'purchaseDetail/delete',
  async ({ id_purchase_detail }, { rejectWithValue, dispatch }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.PURCHASE_DETAIL,
      filterBy: [
        {
          field: firebaseCollectionsKey.purchase_detail,
          condition: '==',
          value: id_purchase_detail,
        },
      ],
    })
      .then((res) => {
        dispatch(
          updatePurchaseListDetailsAction([
            { id_purchase_detail, deleted: true },
          ])
        );
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

export const createRemateAction = createAsyncThunk(
  'purchaseDetail/createRemate',
  async (data, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    const {
      id_purchase,
      rematePrice,
      totalAdvancePayments,
      total,
      list,
      createdBy,
      quantity,
      id_cat_payment_method,
    } = data;
    const id_budget = state.budget.budget.id_budget;

    try {
      return await firestore.runTransaction(async (transaction) => {
        const remateList = list.map((item) => ({
          ...item,
          isRemate: true,
        }));
        // Create new purchase detail for remate
        const newRemateRef = firestore
          .collection(firebaseCollections.PURCHASE_DETAIL)
          .doc();
        const newRemateData = {
          id_purchase_detail: newRemateRef.id,
          id_purchase: firestore.doc(
            `${firebaseCollections.PURCHASE}/${id_purchase}`
          ),
          id_budget: firestore.doc(
            `${firebaseCollections.BUDGET}/${id_budget}`
          ),
          remateBudgetIds: list.map((item) => item.id_budget),
          id_cat_payment_method: firestore.doc(
            `${firebaseCollections.CAT_PAYMENT_METHOD}/${id_cat_payment_method}`
          ),
          price: rematePrice,
          quantity,
          totalAdvancePayments,
          total,
          isRemate: true,
          createdAt: FieldValue.serverTimestamp(),
          deleted: false,
          createdBy,
          isPriceless: false,
        };
        transaction.set(newRemateRef, newRemateData);

        // Update each purchase detail from data.list
        const updatePromises = remateList.map(async (item) => {
          const detailRef = firestore
            .collection(firebaseCollections.PURCHASE_DETAIL)
            .doc(item.id_purchase_detail);
          transaction.update(detailRef, {
            isRemate: true,
            id_purchase_detail_remate: newRemateRef.id,
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: createdBy,
          });
        });

        await Promise.all(updatePromises);

        const result = {
          success: true,
          newRemateId: newRemateRef.id,
          newRemateData: {
            ...newRemateData,
            id_purchase, //string id
            createdBy: createdBy,
            createdAt: new Date(),
          },
          remateListUpdated: remateList,
        };

        // Update the purchase detail list with the new remate data and the updated remate list
        dispatch(
          updatePurchaseListDetailsAction([
            result.newRemateData,
            ...result.remateListUpdated,
          ])
        );

        return result;
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  purchaseDetailSelected: null,
  processing: false,
  purchaseDetailList: [],
  purchaseDetailListPriceless: [],
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
    clearAllPurchaseDetails: (state) => {
      state.purchaseDetailList = [];
      state.purchaseDetailListPriceless = [];
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
        const allPurchaseDetails = purchaseDetailDto.purchaseDetailList(
          payload.data,
          payload.purchaseSelected
        );
        state.purchaseDetailList = allPurchaseDetails.filter(
          (detail) => detail.isPriceless === false
        );
        state.purchaseDetailListPriceless = allPurchaseDetails.filter(
          (detail) => detail.isPriceless === true
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
        if (!payload.nonupdate) {
          const purchaseDetail = purchaseDetailDto.purchaseDetailGetOne(
            payload,
            payload.purchaseSelected
          );
          state.purchaseDetailSelected = purchaseDetail;
          if (purchaseDetail.isPriceless) {
            state.purchaseDetailListPriceless = [
              ...state.purchaseDetailListPriceless,
              purchaseDetail,
            ];
          } else {
            state.purchaseDetailList = [
              ...state.purchaseDetailList,
              purchaseDetail,
            ];
          }
        }
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

        // Remove the old record from both lists
        state.purchaseDetailList = state.purchaseDetailList.filter(
          (detail) =>
            detail[firebaseCollectionsKey.purchase_detail] !==
            updatedPurchaseDetail[firebaseCollectionsKey.purchase_detail]
        );
        state.purchaseDetailListPriceless =
          state.purchaseDetailListPriceless.filter(
            (detail) =>
              detail[firebaseCollectionsKey.purchase_detail] !==
              updatedPurchaseDetail[firebaseCollectionsKey.purchase_detail]
          );

        // Add the updated record to the correct list
        if (updatedPurchaseDetail.isPriceless) {
          state.purchaseDetailListPriceless.push(updatedPurchaseDetail);
        } else {
          state.purchaseDetailList.push(updatedPurchaseDetail);
        }

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
        state.purchaseDetailListPriceless =
          state.purchaseDetailListPriceless.filter(
            (purchaseDetail) =>
              purchaseDetail[firebaseCollectionsKey.purchase_detail] !==
              id_purchaseDetail
          );
        state.processing = false;
      }
    );

    /* CREATE REMATE */
    builder.addCase(createRemateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(createRemateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(createRemateAction.fulfilled, (state, { payload }) => {
      const { newRemateId, newRemateData, remateListUpdated } = payload;
      // Add the new remate to the lists
      const newRemateDetail = purchaseDetailDto.purchaseDetailGetOne({
        ...newRemateData,
        [firebaseCollectionsKey.purchase_detail]: newRemateId,
      });
      state.purchaseDetailList.push(newRemateDetail);

      remateListUpdated.forEach((item) => {
        const index = state.purchaseDetailListPriceless.findIndex(
          (detail) =>
            detail[firebaseCollectionsKey.purchase_detail] ===
            item.id_purchase_detail
        );
        if (index !== -1) {
          state.purchaseDetailListPriceless[index] = item;
        }
      });
      state.processing = false;
    });
  },
});

export const {
  clearPurchaseDetailSelected,
  setPurchaseDetail,
  clearAllPurchaseDetails,
} = purchaseDetailSlice.actions;

export default purchaseDetailSlice.reducer;
