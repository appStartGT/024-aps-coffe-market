import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseCollections, firebaseFilterBuilder, toastAlert } from '@utils';
import {
  getDataFrom,
  updateRecordBy,
  firestore,
  increment,
  insertInto,
} from '@utils/firebaseMethods';
import { updateProductInvetoryAction } from '../productInventory';
import { saleDto } from '@dto';

export const listSalesAction = createAsyncThunk(
  'sales/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(params);
    return await getDataFrom({
      collectionName: firebaseCollections.SALE_DETAIL,
      filterBy,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const salesCreateAction = createAsyncThunk(
  'sales/create',
  async (data, { rejectWithValue, dispatch }) => {
    const body = saleDto.post(data);
    const detail = body.detail;
    const comoboProducts = body.comoboProducts;
    delete body.detail;
    return await firestore
      .runTransaction(async () => {
        //create sale
        const sale = await insertInto({
          collectionName: firebaseCollections.SALE,
          data: { ...body },
          // transaction,
          showAlert: false,
        });
        //save detail in a different collection
        const detailRequests = detail.map(async (detail) => {
          return insertInto({
            collectionName: firebaseCollections.SALE_DETAIL,
            data: {
              ...detail,
              id_sale: sale.id,
              id_inventory_branch: detail.id_inventory_branch,
              id_organization: body.id_organization,
              id_branch: body.id_branch,
            },
            showAlert: false,
          });
        });
        //update inventory_branch for detail
        const invetoryBranchUpdatesRequests = detail.map(async (detail) => {
          return updateRecordBy({
            collectionName: firebaseCollections.INVETORY_BRANCH,
            docId: detail.id_inventory_branch,
            data: {
              quantity: increment(-detail.quantity),
            },
            showAlert: false,
          });
        });
        //update inventory_branch for combo products if present
        const comboInventoryUpdatesRequests =
          comoboProducts?.map(async (product) => {
            return updateRecordBy({
              collectionName: firebaseCollections.INVETORY_BRANCH,
              docId: product.id_inventory_branch,
              data: {
                quantity: increment(-product.quantity),
              },
              showAlert: false,
            });
          }) || [];

        const [detailResponses, invetoryBranchUpdates] = await Promise.all([
          Promise.all(detailRequests),
          Promise.all(invetoryBranchUpdatesRequests),
          Promise.all(comboInventoryUpdatesRequests),
        ]);

        return { sale, invetoryBranchUpdates, detailResponses };
      })
      .then((res) => {
        dispatch(updateProductInvetoryAction(res.invetoryBranchUpdates));
        toastAlert.showToast();
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  salesList: [],
  totalItems: 5,
  processing: false,
  isSaleModalOpen: false,
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSaleModalAcation: (state, { payload }) => {
      state.isSaleModalOpen = payload ?? !state.isSaleModalOpen;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listSalesAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(listSalesAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(listSalesAction.fulfilled, (state, { payload }) => {
      state.salesList = saleDto.list(payload.data);
      state.totalItems = payload.data.length;
      state.processing = false;
    });
    /* Create new sale */
    builder.addCase(salesCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(salesCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.processing = false;
    });
    builder.addCase(salesCreateAction.fulfilled, (state, { payload }) => {
      const sale = saleDto.list(payload.detailResponses);
      state.salesList = [...sale, ...state.salesList];
      state.processing = false;
    });
  },
});

export const { setSaleModalAcation } = salesSlice.actions;

export default salesSlice.reducer;
