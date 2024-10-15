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
import { firestore, FieldValue } from '@config/firebaseConfig';

export const purchaseDetailListAction = createAsyncThunk(
  'purchaseDetail/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(
      cleanModel(params, { allowNulls: true })
    );
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
        return { ...res };
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
  async ({ id_purchase_detail }, { rejectWithValue }) => {
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
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const createRemateAction = createAsyncThunk(
  'purchaseDetail/createRemate',
  async (data, { rejectWithValue }) => {
    const {
      id_purchase,
      rematePrice,
      totalAdvancePayments,
      total,
      list,
      createdBy,
      quantity,
    } = data;

    try {
      return await firestore.runTransaction(async (transaction) => {
        // Create new purchase detail for remate
        const newRemateRef = firestore
          .collection(firebaseCollections.PURCHASE_DETAIL)
          .doc();
        const newRemateData = {
          id_purchase_detail: newRemateRef.id,
          id_purchase: firestore.doc(
            `${firebaseCollections.PURCHASE}/${id_purchase}`
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
        const updatePromises = list.map(async (item) => {
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

        return {
          success: true,
          newRemateId: newRemateRef.id,
          newRemateData: {
            ...newRemateData,
            createdBy: createdBy,
            createdAt: new Date(),
          },
          updatedList: list,
        };
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
  allPurchaseDetails: [],
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
      state.allPurchaseDetails = [];
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
          payload.data
        );
        state.allPurchaseDetails = allPurchaseDetails;
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
          const purchaseDetail =
            purchaseDetailDto.purchaseDetailGetOne(payload);
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
          state.allPurchaseDetails = [
            ...state.allPurchaseDetails,
            purchaseDetail,
          ];
        }
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

        // Update the record in allPurchaseDetails
        state.allPurchaseDetails = state.allPurchaseDetails.map((detail) =>
          detail[firebaseCollectionsKey.purchase_detail] ===
          updatedPurchaseDetail[firebaseCollectionsKey.purchase_detail]
            ? updatedPurchaseDetail
            : detail
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
        state.purchaseDetailListPriceless =
          state.purchaseDetailListPriceless.filter(
            (purchaseDetail) =>
              purchaseDetail[firebaseCollectionsKey.purchase_detail] !==
              id_purchaseDetail
          );
        state.allPurchaseDetails = state.allPurchaseDetails.filter(
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
      const { newRemateId, newRemateData, updatedList } = payload;
      // Add the new remate to the lists
      const newRemateDetail = purchaseDetailDto.purchaseDetailGetOne({
        ...newRemateData,
        [firebaseCollectionsKey.purchase_detail]: newRemateId,
      });
      state.purchaseDetailList.push(newRemateDetail);
      state.allPurchaseDetails.push(newRemateDetail);

      // Update the existing purchase details
      state.allPurchaseDetails = state.allPurchaseDetails.map((detail) => {
        const updatedDetail = updatedList.find(
          (item) =>
            item.id_purchase_detail ===
            detail[firebaseCollectionsKey.purchase_detail]
        );
        if (updatedDetail) {
          return {
            ...detail,
            isRemate: true,
            id_purchase_detail_remate: newRemateId,
          };
        }
        return detail;
      });

      // Update purchaseDetailList and purchaseDetailListPriceless
      state.purchaseDetailList = state.allPurchaseDetails.filter(
        (detail) => !detail.isPriceless
      );
      state.purchaseDetailListPriceless = state.allPurchaseDetails.filter(
        (detail) => detail.isPriceless
      );

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