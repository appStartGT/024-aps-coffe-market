import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saleDto } from '@dto';
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
import { beneficioCreateAction, beneficioUpdateAction } from '../beneficio';
import { updateTruckloadList } from '../truckload';

export const saleListAction = createAsyncThunk(
  'sale/list',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      let { rowSales, rowSaleDetails, rowTruckloads, rowPurchaseDetails } =
        state.sale;

      // if (
      //   rowSales.length > 0 &&
      //   rowTruckloads.length > 0 &&
      //   rowPurchaseDetails.length > 0
      // ) {
      //   const { saleList, purchaseDetailsResult } = saleDto.saleList(
      //     rowSales,
      //     rowSaleDetails,
      //     rowTruckloads,
      //     rowPurchaseDetails
      //   );
      //   return {
      //     isUpdateNeeded: false,
      //     rowSales,
      //     rowSaleDetails,
      //     rowTruckloads,
      //     rowPurchaseDetails,
      //     saleList,
      //     purchaseDetailsResult,
      //   };
      // }

      const sales = await getAllDocuments({
        collectionName: firebaseCollections.SALE,
      });

      rowSales = sales.data;
      rowSaleDetails = await Promise.all(
        rowSales.map(async (sale) => {
          const saleDetails = await getAllDocuments({
            collectionName: firebaseCollections.SALE_DETAIL,
            filterBy: [
              {
                field: firebaseCollectionsKey.sale,
                condition: '==',
                value: sale.id_sale,
                reference: true,
              },
            ],
            excludeReferences: [
              firebaseCollectionsKey.sale,
              'id_sale_detail_remate',
            ],
          });
          return saleDetails.data;
        })
      );

      rowTruckloads = await Promise.all(
        rowSales.map(async (sale) => {
          const truckloads = await getAllDocuments({
            collectionName: firebaseCollections.BENEFICIO_TRUCKLOAD,
            filterBy: [
              {
                field: firebaseCollectionsKey.sale,
                condition: '==',
                value: sale.id_sale,
                reference: true,
              },
              // {
              //   field: 'isAccumulated',
              //   condition: '==',
              //   value: false,
              // },
            ],
            excludeReferences: [firebaseCollectionsKey.sale],
          });
          return truckloads.data;
        })
      );

      // Get all purchase details
      rowPurchaseDetails = await getAllDocuments({
        collectionName: firebaseCollections.PURCHASE_DETAIL,
        excludeReferences: [
          'id_purchase_detail_remate',
          firebaseCollectionsKey.purchase,
          firebaseCollectionsKey.budget,
        ],
      });

      // Flatten the array of arrays
      rowSaleDetails = rowSaleDetails.flat();
      rowTruckloads = rowTruckloads.flat();
      rowPurchaseDetails = rowPurchaseDetails.data;

      const { saleList, purchaseDetailsResult } = saleDto.saleList(
        rowSales,
        rowSaleDetails,
        rowTruckloads,
        rowPurchaseDetails
      );

      return {
        isUpdateNeeded: true,
        rowSales,
        rowSaleDetails,
        rowTruckloads,
        rowPurchaseDetails,
        saleList,
        purchaseDetailsResult,
      };
    } catch (error) {
      console.error(error);
      return rejectWithValue(error);
    }
  }
);

export const saleCreateAction = createAsyncThunk(
  'sale/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel({ ...data });

    // Create beneficio first
    const beneficioData = {
      name: body.name,
      surNames: body.surNames,
      email: body.email,
      phone: body.phone,
      nit: body.nit,
      DPI: body.DPI,
      address: body.address,
    };

    const beneficioResponse = await dispatch(
      beneficioCreateAction(beneficioData)
    ).unwrap();
    const id_beneficio = beneficioResponse.id_beneficio;

    const saleData = {
      id_beneficio,
    };

    return await insertDocument({
      collectionName: firebaseCollections.SALE,
      data: saleData,
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

export const saleGetOneAction = createAsyncThunk(
  'sale/getOne',
  async ({ id_sale }, { rejectWithValue, dispatch, getState }) => {
    dispatch(setLoadingMainViewAction(true));

    const state = getState();
    const rowSales = state.sale.rowSales;
    const sale = rowSales.find((sale) => sale.id_sale === id_sale);

    if (sale) {
      dispatch(setLoadingMainViewAction(false));
      return sale;
    }

    return await getAllDocuments({
      collectionName: firebaseCollections.SALE,
      filterBy: [
        {
          field: 'id_sale',
          condition: '==',
          value: id_sale,
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

export const getOneAllDetalleSaleAction = createAsyncThunk(
  'sale/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getAllDocuments({
      collectionName: firebaseCollections.SALE,
      nonReferenceField: firebaseCollectionsKey.sale,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const saleUpdateAction = createAsyncThunk(
  'sale/update',
  async (data, { dispatch }) => {
    await dispatch(beneficioUpdateAction(data)).unwrap();

    return {
      ...data,
    };
  }
);
export const saleDeleteAction = createAsyncThunk(
  'sale/delete',
  async ({ id_sale }, { rejectWithValue }) => {
    const batch = firestore.batch();

    try {
      // Update Sale
      const saleRef = firestore
        .collection(firebaseCollections.SALE)
        .doc(id_sale);
      batch.update(saleRef, { deleted: true });

      // Update Sale Details
      const saleDetailsSnapshot = await firestore
        .collection(firebaseCollections.SALE_DETAIL)
        .where(
          firebaseCollectionsKey.sale,
          '==',
          firestore.doc(`${firebaseCollections.SALE}/${id_sale}`)
        )
        .get();
      saleDetailsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { deleted: true });
      });

      // Update Truckloads
      const truckloadsSnapshot = await firestore
        .collection(firebaseCollections.BENEFICIO_TRUCKLOAD)
        .where(
          firebaseCollectionsKey.sale,
          '==',
          firestore.doc(`${firebaseCollections.SALE}/${id_sale}`)
        )
        .get();
      truckloadsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { deleted: true });
      });

      // Commit the batch
      await batch.commit();

      return { ids: [id_sale] };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSaleListDetailsAction = createAsyncThunk(
  'sale/updateListDetails',
  async (newDetails, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentDetails = state.sale.rowSaleDetails;

      // Merge new details with existing ones, overwriting if there's a conflict
      let updatedDetails = [...currentDetails];
      newDetails.forEach((newDetail) => {
        const index = updatedDetails.findIndex(
          (detail) => detail.id_sale_detail === newDetail.id_sale_detail
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

export const updateSaleListPurchaseDetailsAction = createAsyncThunk(
  'sale/updateListPurchaseDetails',
  async (newDetails, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentDetails = state.sale.rowPurchaseDetails;

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

      // Remove items with deleted: truea
      updatedDetails = updatedDetails.filter(
        (detail) => detail.deleted !== true
      );

      return updatedDetails;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSaleListTruckloadsAction = createAsyncThunk(
  'sale/updateListTruckloads',
  async (newDetails, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const currentDetails = state.sale.rowTruckloads;
      // Merge new details with existing ones, overwriting if there's a conflict
      let updatedDetails = [...currentDetails];
      newDetails.forEach((newDetail) => {
        const index = updatedDetails.findIndex(
          (detail) =>
            detail.id_beneficio_truckload === newDetail.id_beneficio_truckload
        );
        if (index !== -1) {
          updatedDetails[index] = {
            ...updatedDetails[index],
            ...newDetail,
          };
        } else {
          updatedDetails.push(newDetail);
        }
      });

      // Remove items with deleted: true
      updatedDetails = updatedDetails.filter(
        (detail) => detail.deleted !== true
      );
      
      //update truckload list in  main view
      dispatch(updateTruckloadList(updatedDetails));

      return updatedDetails;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  saleSelected: null,
  processing: false,
  saleList: [],
  totalItems: 5,
  salePaymentSelected: [],
  totalPayments: 5,
  rowSales: [], // Updated in saleListAction.fulfilled
  rowSaleDetails: [], // Updated in saleListAction.fulfilled and updateSaleListDetailsAction.fulfilled
  rowTruckloads: [], // Updated in saleListAction.fulfilled
  rowPurchaseDetails: [], // Updated in saleListAction.fulfilled
  purchaseDetailsResult: null,
  statistics: null,
};

export const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    clearSaleSelected: (state) => {
      state.saleSelected = null;
    },
    clearSalePaymentSelected: (state) => {
      state.salePaymentSelected = [];
    },
    setNewGeneralTotal: (state, payload) => {
      state.saleSelected.total = payload.payload;
    },
    setDataStatistics: (state, { payload }) => {
      state.statistics = payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(saleListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleListAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(saleListAction.fulfilled, (state, { payload }) => {
      if (payload.isUpdateNeeded) {
        state.saleList = payload.saleList;
        state.purchaseDetailsResult = payload.purchaseDetailsResult;
        // Update rowSales, rowSaleDetails, rowTruckloads, and rowPurchaseDetails
        state.rowSales = payload.rowSales;
        state.rowSaleDetails = payload.rowSaleDetails;
        state.rowTruckloads = payload.rowTruckloads;
        state.rowPurchaseDetails = payload.rowPurchaseDetails;
      }
      state.totalItems = payload.rowSales.length;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(saleCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(saleCreateAction.fulfilled, (state, { payload }) => {
      const sale = saleDto.saleGetOne(payload);
      state.saleSelected = sale;
      state.saleList = [...state.saleList, sale];
      // Update rowSales
      state.rowSales = [...state.rowSales, payload];
      state.processing = false;
    });
    /* GET ONE */
    builder.addCase(saleGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleGetOneAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(saleGetOneAction.fulfilled, (state, { payload }) => {
      const selectedSale = saleDto.saleGetOne(payload);
      state.saleSelected = selectedSale;
      state.salePaymentSelected = selectedSale.payments;
      state.processing = false;
    });

    /* SERVICIO UPDATE */
    builder.addCase(saleUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleUpdateAction.rejected, (state, action) => {
      console.error(action);
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(saleUpdateAction.fulfilled, (state, { payload }) => {
      const updatedSale = saleDto.saleGetOne(payload);
      state.saleSelected = updatedSale;
      state.saleList = saleDto.updateListSale(state.saleList, payload);
      // Update rowSales
      state.rowSales = state.rowSales.map((sale) =>
        sale.id_sale === payload.id_sale ? payload : sale
      );
      state.salePaymentSelected = updatedSale.payments;
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(saleDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(saleDeleteAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(saleDeleteAction.fulfilled, (state, { payload }) => {
      const id_sale = payload.ids[0];
      state.saleList = state.saleList.filter((sale) => sale.id !== id_sale);
      // Update rowSales, rowSaleDetails, and rowTruckloads
      state.rowSales = state.rowSales.filter(
        (sale) => sale.id_sale !== id_sale
      );
      state.rowSaleDetails = state.rowSaleDetails.filter(
        (detail) => detail.id_sale !== id_sale
      );
      state.rowTruckloads = state.rowTruckloads.filter(
        (truckload) => truckload.id_sale !== id_sale
      );
      const { saleList, purchaseDetailsResult } = saleDto.saleList(
        state.rowSales,
        state.rowSaleDetails,
        state.rowTruckloads,
        state.rowPurchaseDetails
      );
      state.saleList = saleList;
      state.purchaseDetailsResult = purchaseDetailsResult;
      state.processing = false;
    });

    /* UPDATE SALE LIST DETAILS */
    builder.addCase(
      updateSaleListDetailsAction.fulfilled,
      (state, { payload }) => {
        // Update rowSaleDetails
        state.rowSaleDetails = [...payload];
        const { saleList, purchaseDetailsResult } = saleDto.saleList(
          state.rowSales,
          state.rowSaleDetails,
          state.rowTruckloads,
          state.rowPurchaseDetails
        );
        state.saleList = saleList;
        state.purchaseDetailsResult = purchaseDetailsResult;
      }
    );
    builder.addCase(
      updateSaleListTruckloadsAction.fulfilled,
      (state, { payload }) => {
        state.rowTruckloads = [...payload];
        const { saleList, purchaseDetailsResult } = saleDto.saleList(
          state.rowSales,
          state.rowSaleDetails,
          state.rowTruckloads,
          state.rowPurchaseDetails
        );
        state.saleList = saleList;
        state.purchaseDetailsResult = purchaseDetailsResult;
      }
    );
    /* UPDATE SALE LIST PURCHASE DETAILS */
    builder.addCase(
      updateSaleListPurchaseDetailsAction.fulfilled,
      (state, { payload }) => {
        if (state.rowPurchaseDetails.length > 0) {
          state.rowPurchaseDetails = [...payload];
          const { saleList, purchaseDetailsResult } = saleDto.saleList(
            state.rowSales,
            state.rowSaleDetails,
            state.rowTruckloads,
            state.rowPurchaseDetails
          );
          state.saleList = saleList;
          state.purchaseDetailsResult = purchaseDetailsResult;
        }
      }
    );
  },
});

export const {
  clearSaleSelected,
  clearSalePaymentSelected,
  setNewGeneralTotal,
  setDataStatistics,
} = saleSlice.actions;

export default saleSlice.reducer;
