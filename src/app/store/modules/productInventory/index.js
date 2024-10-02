import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryBranchDto } from '@dto';
import { cleanModel, firebaseCollections, firebaseFilterBuilder } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getDataFrom,
  updateRecordBy,
  deleteRecordById,
  insertInto,
  bulkInsertIntoReferences,
} from '@utils/firebaseMethods';

export const inventoryBranchListAction = createAsyncThunk(
  'inventory_branch/list',
  async (params, { rejectWithValue }) => {
    const newParams = cleanModel(params);
    const filterBy = firebaseFilterBuilder(newParams);
    return await getDataFrom({
      collectionName: firebaseCollections.INVETORY_BRANCH,
      filterBy,
      nonReferenceField: 'id_inventory_branch',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryBranchCreateAction = createAsyncThunk(
  'inventory_branch/create',
  async (data, { rejectWithValue, dispatch }) => {
    const orgData = data.inventory.map((p) => ({
      ...p,
      key: 'id_inventory_branch',
    }));

    const orgDataOrders = data.orders.map((p) => ({
      ...p,
      key: 'id_tracking_inventory',
    }));

    await bulkInsertIntoReferences({
      collectionName: firebaseCollections.TRACKING_INVENTORY,
      dataArray: orgDataOrders,
    });

    return await bulkInsertIntoReferences({
      collectionName: firebaseCollections.INVETORY_BRANCH,
      dataArray: orgData,
    })
      .then((res) => {
        return res;
      })
      .catch((res) => {
        return rejectWithValue(res);
      })
      .finally(() => {
        dispatch(setLoadingMainViewAction(false));
      });
  }
);

export const inventoryBranchGetOneAction = createAsyncThunk(
  'inventory_branch/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getDataFrom({
      collectionName: firebaseCollections.INVETORY_BRANCH,
      docId: id,
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

export const getOneAllDetalleInventoryBranchAction = createAsyncThunk(
  'inventory_branch/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: firebaseCollections.INVETORY_BRANCH,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryBranchUpdateAction = createAsyncThunk(
  'inventory_branch/update',
  async (data, { rejectWithValue }) => {
    const orgData = {
      ...data,
    };

    if (orgData.orders) {
      await insertInto({
        collectionName: 'order_provider',
        data: cleanModel(orgData.orders),
      });
      delete orgData.orders;
    }

    return await updateRecordBy({
      collectionName: firebaseCollections.INVETORY_BRANCH,
      filterBy: [
        {
          field: 'id_inventory_branch',
          condition: '==',
          value: orgData.inventory.id_inventory_branch,
        },
      ],
      data: cleanModel(orgData.inventory),
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryBranchDeleteAction = createAsyncThunk(
  'inventory_branch/delete',
  async ({ id_inventory_branch }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.INVETORY_BRANCH,
      filterBy: [
        {
          field: 'id_inventory_branch',
          condition: '==',
          value: id_inventory_branch,
        },
      ],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryBranchListComboAction = createAsyncThunk(
  'inventory_branch/list/combo',
  async (params, { rejectWithValue }) => {
    const newParams = cleanModel(params);
    const filterBy = firebaseFilterBuilder(newParams);
    return await getDataFrom({
      collectionName: firebaseCollections.INVETORY_BRANCH,
      filterBy,
      nonReferenceField: 'id_inventory_branch',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryBranchCreateOneitemAction = createAsyncThunk(
  'inventory_branch/createOne',
  async (data, { rejectWithValue, dispatch }) => {
    const orgData = {
      ...data,
      key: 'id_inventory_branch',
    };

    return await insertInto({
      collectionName: firebaseCollections.INVETORY_BRANCH,
      data: cleanModel(orgData),
    })
      .then((res) => {
        return res;
      })
      .catch((res) => {
        return rejectWithValue(res);
      })
      .finally(() => {
        dispatch(setLoadingMainViewAction(false));
      });
  }
);

const initialState = {
  inventorySelected: null,
  processing: false,
  processingProductList: false,
  productInventoryList: [],
  totalItems: 5,
  totalPayments: 5,
  productInventoryListCombo: [],
};

export const inventoryBranchSlice = createSlice({
  name: firebaseCollections.INVETORY_BRANCH,
  initialState,
  reducers: {
    clearInventorySelected: (state) => {
      state.inventorySelected = null;
    },
    clearProductInventoryListAction: (state) => {
      state.productInventoryList = [];
    },
    updateProductInvetoryAction: (state, { payload }) => {
      if (Array.isArray(payload)) {
        payload.forEach((product) => {
          const productIndex = state.productInventoryList.findIndex(
            (p) => p.id_inventory_branch == product.id_inventory_branch
          );

          if (productIndex > -1) {
            state.productInventoryList[productIndex].quantity =
              product.quantity;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(inventoryBranchListAction.pending, (state) => {
      state.processingProductList = true;
    });
    builder.addCase(
      inventoryBranchListAction.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.processingProductList = false;
      }
    );
    builder.addCase(
      inventoryBranchListAction.fulfilled,
      (state, { payload }) => {
        state.productInventoryList = inventoryBranchDto.inventoryList(
          payload.data
        );
        state.totalItems = payload.data.totalItems;
        state.processingProductList = false;
      }
    );

    /* SERVICIO LIST Combo*/
    builder.addCase(inventoryBranchListComboAction.pending, (state) => {
      state.processingProductList = true;
    });
    builder.addCase(
      inventoryBranchListComboAction.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.processingProductList = false;
      }
    );
    builder.addCase(
      inventoryBranchListComboAction.fulfilled,
      (state, { payload }) => {
        state.productInventoryListCombo = inventoryBranchDto.inventoryList(
          payload.data
        );
        state.totalItems = payload.data.totalItems;
        state.processingProductList = false;
      }
    );

    /*  CREATE */
    builder.addCase(inventoryBranchCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      inventoryBranchCreateAction.rejected,
      (state, { payload }) => {
        console.error(payload);
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      inventoryBranchCreateAction.fulfilled,
      (state, { payload }) => {
        const organization = inventoryBranchDto.inventoryList(payload);
        state.productInventoryList = inventoryBranchDto.addCreateNew(
          state.productInventoryList,
          organization
        );
        state.processing = false;
      }
    );
    /* GET ONE */
    builder.addCase(inventoryBranchGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      inventoryBranchGetOneAction.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      inventoryBranchGetOneAction.fulfilled,
      (state, { payload }) => {
        const datoSeleccioando = inventoryBranchDto.inventoryGetOne(payload);
        state.inventorySelected = datoSeleccioando;

        state.processing = false;
      }
    );

    /* SERVICIO UPDATE */
    builder.addCase(inventoryBranchUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      inventoryBranchUpdateAction.rejected,
      (state, { payload }) => {
        console.error(payload);
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      inventoryBranchUpdateAction.fulfilled,
      (state, { payload }) => {
        const updatedOrganization = inventoryBranchDto.inventoryGetOne(payload);
        state.inventorySelected = updatedOrganization;
        state.productInventoryList = inventoryBranchDto.updateListOrganization(
          state.productInventoryList,
          payload
        );
        state.processing = false;
      }
    );

    /*  DELETE */
    builder.addCase(inventoryBranchDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(inventoryBranchDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      inventoryBranchDeleteAction.fulfilled,
      (state, { payload }) => {
        const id_inventory_branch = payload.ids[0];
        state.productInventoryList = state.productInventoryList.filter(
          (org) => org.id !== id_inventory_branch
        );
        state.processing = false;
      }
    );

    // create one
    builder.addCase(inventoryBranchCreateOneitemAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      inventoryBranchCreateOneitemAction.rejected,
      (state, { payload }) => {
        console.error(payload);
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      inventoryBranchCreateOneitemAction.fulfilled,
      (state, { payload }) => {
        const organization = inventoryBranchDto.inventoryGetOne(payload);
        state.productInventoryList = inventoryBranchDto.addCreateNew(
          state.productInventoryListCombo,
          [organization]
        );
        state.processing = false;
      }
    );
  },
});

export const {
  clearInventorySelected,
  clearProductInventoryListAction,
  updateProductInvetoryAction,
} = inventoryBranchSlice.actions;

export default inventoryBranchSlice.reducer;
