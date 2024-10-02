import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryDto } from '@dto';
import { cleanModel, firebaseCollections, firebaseFilterBuilder } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getDataFrom,
  updateRecordBy,
  deleteRecordById,
  insertInto,
} from '@utils/firebaseMethods';

export const inventoryListAction = createAsyncThunk(
  'inventory/list',
  async (params, { rejectWithValue }) => {
    const newParams = cleanModel(params);
    const filterBy = firebaseFilterBuilder(newParams);
    return await getDataFrom({
      collectionName: firebaseCollections.INVENTORY,
      filterBy,
      nonReferenceField: 'id_inventory',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryCreateAction = createAsyncThunk(
  'inventory/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);

    const orgData = {
      key: 'id_inventory',
      ...body,
    };

    const filterBy = [{ name: orgData.name }];

    const datos = await getDataFrom({
      collectionName: firebaseCollections.INVENTORY,
      filterBy,
      nonReferenceField: 'id_inventory',
    });

    if (datos.data.lenght) {
      dispatch(setLoadingMainViewAction(false));
      return rejectWithValue();
    } else {
      return await insertInto({
        collectionName: firebaseCollections.INVENTORY,
        data: orgData,
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
  }
);

export const inventoryGetOneAction = createAsyncThunk(
  'inventory/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getDataFrom({
      collectionName: firebaseCollections.INVENTORY,
      docId: id,
      nonReferenceField: 'id_inventory',
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

export const getOneAllDetalleInventoryAction = createAsyncThunk(
  'inventory/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: firebaseCollections.INVENTORY,
      nonReferenceField: 'id_inventory',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryUpdateAction = createAsyncThunk(
  'inventory/update',
  async (data, { rejectWithValue }) => {
    let body = inventoryDto.organizationPut(data);

    const orgData = {
      ...body,
    };

    return await updateRecordBy({
      collectionName: firebaseCollections.INVENTORY,
      filterBy: [
        {
          field: 'id_inventory',
          condition: '==',
          value: orgData.id_inventory,
        },
      ],
      data: orgData,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryDeleteAction = createAsyncThunk(
  'inventory/delete',
  async ({ id_inventory }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.INVENTORY,
      filterBy: [
        { field: 'id_inventory', condition: '==', value: id_inventory },
      ],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const inventoryProductListAction = createAsyncThunk(
  'inventory/product/list',
  async (params, { rejectWithValue }) => {
    const newParams = cleanModel(params);
    const filterBy = firebaseFilterBuilder(newParams);
    return await getDataFrom({
      collectionName: firebaseCollections.PRODUCT_INVENTORY,
      filterBy,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  inventorySelected: null,
  processing: false,
  processingProductList: false,
  inventoryList: [],
  productInventoryList: [],
  totalItems: 5,
  totalPayments: 5,
};

export const organizationSlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventorySelected: (state) => {
      state.inventorySelected = null;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(inventoryListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(inventoryListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(inventoryListAction.fulfilled, (state, { payload }) => {
      state.inventoryList = inventoryDto.inventoryList(payload.data);
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(inventoryCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(inventoryCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(inventoryCreateAction.fulfilled, (state, { payload }) => {
      const organization = inventoryDto.inventoryGetOne(payload);
      state.inventorySelected = organization;
      state.processing = false;
    });
    /* GET ONE */
    builder.addCase(inventoryGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(inventoryGetOneAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(inventoryGetOneAction.fulfilled, (state, { payload }) => {
      const datoSeleccioando = inventoryDto.inventoryGetOne(payload);
      state.inventorySelected = datoSeleccioando;

      state.processing = false;
    });

    /* SERVICIO UPDATE */
    builder.addCase(inventoryUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(inventoryUpdateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(inventoryUpdateAction.fulfilled, (state, { payload }) => {
      const updatedOrganization = inventoryDto.inventoryGetOne(payload);
      state.inventorySelected = updatedOrganization;
      state.inventoryList = inventoryDto.updateListOrganization(
        state.inventoryList,
        payload
      );
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(inventoryDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(inventoryDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(inventoryDeleteAction.fulfilled, (state, { payload }) => {
      const id_inventory = payload.ids[0];
      state.inventoryList = state.inventoryList.filter(
        (org) => org.id !== id_inventory
      );
      state.processing = false;
    });

    /* SERVICIO LIST PRODUCT INVENTORY */
    builder.addCase(inventoryProductListAction.pending, (state) => {
      state.processingProductList = true;
    });
    builder.addCase(
      inventoryProductListAction.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.processingProductList = false;
      }
    );
    builder.addCase(
      inventoryProductListAction.fulfilled,
      (state, { payload }) => {
        state.inventoryList = inventoryDto.inventoryProductList(payload.data);
        state.totalItems = payload.data.totalItems;
        state.processingProductList = false;
      }
    );
  },
});

export const { clearInventorySelected } = organizationSlice.actions;

export default organizationSlice.reducer;
