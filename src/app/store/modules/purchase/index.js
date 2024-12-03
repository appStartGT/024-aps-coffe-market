import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { purchaseDto } from '@dto';
import {
  cleanModel,
  firebaseCollections,
  firebaseCollectionsKey,
} from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getAllDocuments,
  insertDocument,
  firestore,
} from '@utils/firebaseMethods';
import { customerCreateAction, customerUpdateAction } from '../customer';
import { setOldBudget } from '../budget';

export const purchaseListAction = createAsyncThunk(
  'purchase/list',
  async ({ id_budget, force }, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState();
      const old_budget = state.budget.old_budget;
      let { rowPurchases, rowPurchaseDetails } = state.purchase;
      if (!force && rowPurchases.length > 0 && rowPurchaseDetails.length > 0) {
        return {
          isUpdateNeeded: false,
          rowPurchases,
          rowPurchaseDetails: rowPurchaseDetails.filter(
            (detail) => detail.budget?.id_budget === id_budget
          ),
        };
      }

      const purchases = await getAllDocuments({
        collectionName: firebaseCollections.PURCHASE,
        excludeReferences: [firebaseCollectionsKey.budget],
      });

      rowPurchases = purchases.data;
      rowPurchaseDetails = await Promise.all(
        rowPurchases.map(async (purchase) => {
          const purchaseDetails = await getAllDocuments({
            collectionName: firebaseCollections.PURCHASE_DETAIL,
            filterBy: [
              {
                field: firebaseCollectionsKey.purchase,
                condition: '==',
                value: purchase.id_purchase,
                reference: true,
              },
              {
                field: firebaseCollectionsKey.budget,
                condition: '==',
                value: id_budget,
                reference: true,
              },
            ],
            excludeReferences: [
              firebaseCollectionsKey.purchase,
              'id_purchase_detail_remate', //this collection does not have a reference to purchase
            ],
          });
          return purchaseDetails.data;
        })
      );
      // Clear old budget when a new budget is created
      if (old_budget && old_budget?.id_budget !== id_budget)
        dispatch(setOldBudget(null));
      // Flatten the array of arrays
      rowPurchaseDetails = rowPurchaseDetails.flat();

      return {
        isUpdateNeeded: true,
        rowPurchases,
        rowPurchaseDetails,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const purchaseCreateAction = createAsyncThunk(
  'purchase/create',
  async (data, { rejectWithValue, dispatch /* getState */ }) => {
    dispatch(setLoadingMainViewAction(true));
    // const state = getState();
    // const id_budget = state.budget.budget.id_budget;
    let body = cleanModel({ ...data });

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
      id_customer,
      // id_budget,
    };

    return await insertDocument({
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
  async ({ id_purchase }, { rejectWithValue, dispatch, getState }) => {
    dispatch(setLoadingMainViewAction(true));

    const state = getState();
    const rowPurchases = state.purchase.rowPurchases;
    const purchase = rowPurchases.find(
      (purchase) => purchase.id_purchase === id_purchase
    );

    if (purchase) {
      dispatch(setLoadingMainViewAction(false));
      return purchase;
    }

    return await getAllDocuments({
      collectionName: firebaseCollections.PURCHASE,
      filterBy: [
        {
          field: 'id_purchase',
          condition: '==',
          value: id_purchase,
        },
      ],
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res.data[0];
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
    return await getAllDocuments({
      collectionName: firebaseCollections.PURCHASE,
      nonReferenceField: firebaseCollectionsKey.purchase,
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
    const batch = firestore.batch();

    try {
      // Update Purchase
      const purchaseRef = firestore
        .collection(firebaseCollections.PURCHASE)
        .doc(id_purchase);
      batch.update(purchaseRef, { deleted: true });

      // Update Purchase Details
      const purchaseDetailsSnapshot = await firestore
        .collection(firebaseCollections.PURCHASE_DETAIL)
        .where(
          firebaseCollectionsKey.purchase,
          '==',
          firestore.doc(`${firebaseCollections.PURCHASE}/${id_purchase}`)
        )
        .get();
      purchaseDetailsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { deleted: true });
      });

      // Commit the batch
      await batch.commit();

      return { ids: [id_purchase] };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePurchaseListDetailsAction = createAsyncThunk(
  'purchase/updateListDetails',
  async (newDetails, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentDetails = state.purchase.rowPurchaseDetails;

      // Merge new details with existing ones, overwriting if there's a conflict
      let updatedDetails = [...currentDetails];
      newDetails.forEach((newDetail) => {
        const index = updatedDetails.findIndex(
          (detail) => detail.id_purchase_detail === newDetail.id_purchase_detail
        );
        if (index !== -1) {
          updatedDetails[index] = { ...updatedDetails[index], ...newDetail };
        } else {
          updatedDetails.push(newDetail);
        }
      });

      // Remove items with deleted: true
      updatedDetails = updatedDetails.filter(
        (detail) => detail.deleted !== true
      );

      return updatedDetails;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  purchaseSelected: null,
  processing: false,
  purchaseList: [],
  totalItems: 5,
  purchasePaymentSelected: [],
  totalPayments: 5,
  rowPurchases: [], // Updated in purchaseListAction.fulfilled
  rowPurchaseDetails: [], // Updated in purchaseListAction.fulfilled and updatePurchaseListDetailsAction.fulfilled
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
      if (payload.isUpdateNeeded) {
        state.purchaseList = purchaseDto.purchaseList(
          payload.rowPurchases,
          payload.rowPurchaseDetails
        );
        // Update rowPurchases and rowPurchaseDetails
        state.rowPurchases = payload.rowPurchases;
        state.rowPurchaseDetails = payload.rowPurchaseDetails;
      }
      state.totalItems = payload.length;
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
      state.purchaseList = [...state.purchaseList, purchase];
      // Update rowPurchases
      state.rowPurchases = [...state.rowPurchases, payload];
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
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(purchaseUpdateAction.fulfilled, (state, { payload }) => {
      const updatedPurchase = purchaseDto.purchaseGetOne(payload);
      state.purchaseSelected = updatedPurchase;
      state.purchaseList = purchaseDto.updateListPurchase(
        state.purchaseList,
        payload
      );
      // Update rowPurchases
      state.rowPurchases = state.rowPurchases.map((purchase) =>
        purchase.id_purchase === payload.id_purchase ? payload : purchase
      );
      state.purchasePaymentSelected = updatedPurchase.payments;
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(purchaseDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(purchaseDeleteAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(purchaseDeleteAction.fulfilled, (state, { payload }) => {
      const id_purchase = payload.ids[0];
      state.purchaseList = state.purchaseList.filter(
        (purchase) => purchase.id !== id_purchase
      );
      // Update rowPurchases and rowPurchaseDetails
      state.rowPurchases = state.rowPurchases.filter(
        (purchase) => purchase.id_purchase !== id_purchase
      );
      state.rowPurchaseDetails = state.rowPurchaseDetails.filter(
        (detail) => detail.id_purchase !== id_purchase
      );
      state.processing = false;
    });

    /* UPDATE PURCHASE LIST DETAILS */
    builder.addCase(
      updatePurchaseListDetailsAction.fulfilled,
      (state, { payload }) => {
        // Update rowPurchaseDetails
        state.rowPurchaseDetails = [...payload];
        state.purchaseList = purchaseDto.purchaseList(
          state.rowPurchases,
          state.rowPurchaseDetails
        );
      }
    );
  },
});

export const { clearPurchaseSelected, clearPurchasePaymentSelected } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;
