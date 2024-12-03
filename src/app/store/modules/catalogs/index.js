import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { catalogsDto } from '@dto';
import { getAllDocuments, insertDocument } from '@utils/firebaseMethods';
import { firebaseCollections, firebaseCollectionsKey } from '@utils/constants';

export const rolesCatalogAction = createAsyncThunk(
  'catalogs/roles',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.roles.length > 0) {
      return { data: state.catalogs.roles };
    }
    return await getAllDocuments({
      collectionName: 'role',
      filterBy: [{ field: 'isActive', condition: '==', value: true }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const userCatalogAction = createAsyncThunk(
  'catalogs/user',
  async (_, { getState }) => {
    const state = getState();
    if (state.catalogs.users.length > 0) {
      return state.catalogs.users;
    }
    return state.user.userList;
  }
);

export const paymentMethodCatalogAction = createAsyncThunk(
  'catalogs/paid-method',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.cat_payment_method.length > 0) {
      return { data: state.catalogs.cat_payment_method, isLocal: true };
    }
    return await getAllDocuments({
      collectionName: firebaseCollections.CAT_PAYMENT_METHOD,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const catExpenseTypeCatalogAction = createAsyncThunk(
  'catalogs/cat-expense-type',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.cat_expense_type.length > 0) {
      return { data: state.catalogs.cat_expense_type, isLocal: true };
    }
    return await getAllDocuments({
      collectionName: firebaseCollections.CAT_EXPENSE_TYPE,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const catTruckloadLicensePlateCatalogAction = createAsyncThunk(
  'catalogs/cat-truckload-license-plate',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.cat_truckload_license_plate.length > 0) {
      return {
        data: state.catalogs.cat_truckload_license_plate,
        isLocal: true,
      };
    }
    return await getAllDocuments({
      collectionName: firebaseCollections.CAT_TRUCKLOAD_LICENSE_PLATE,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const catRubroCatalogAction = createAsyncThunk(
  'catalogs/cat-rubro',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.cat_rubro.length > 0) {
      return { data: state.catalogs.cat_rubro, isLocal: true };
    }
    return await getAllDocuments({
      collectionName: firebaseCollections.CAT_RUBRO,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const catLoanTypeCatalogAction = createAsyncThunk(
  'catalogs/cat-loan-type',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.cat_loan_type.length > 0) {
      return { data: state.catalogs.cat_loan_type, isLocal: true };
    }
    return await getAllDocuments({
      collectionName: firebaseCollections.CAT_LOAN_TYPE,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const insertNewOptionAction = createAsyncThunk(
  'catalogs/insertNewOption',
  async ({ catalog, name }, { rejectWithValue }) => {
    try {
      const result = await insertDocument({
        collectionName: catalog,
        data: {
          name,
          isActive: true,
        },
      });
      return { ...result, catalog };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCatalogAction = createAsyncThunk(
  'catalogs/getCatalog',
  async ({ catalog }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      // Check if catalog data already exists in redux store
      if (state.catalogs[catalog]?.length > 0) {
        return { catalog: state.catalogs[catalog], isLocal: true };
      }

      return await getAllDocuments({
        collectionName: catalog,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  processing: false,
  roles: [],
  users: [],
  person: [],
  cat_payment_method: [],
  cat_expense_type: [],
  cat_truckload_license_plate: [],
  cat_rubro: [],
  cat_loan_type: [],
  newOptionModal: {
    open: false,
    fields: [],
    inputValue: undefined,
    catalog: undefined,
  },
};

export const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {
    newOptionModalAction: (state, action) => {
      state.newOptionModal = { ...state.newOptionModal, ...action.payload };
    },
    clearLastSelected: (state) => {
      state.lastCategory = null;
      state.lastMeasureType = null;
      state.lastProvider = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rolesCatalogAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(rolesCatalogAction.rejected, (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      })
      .addCase(rolesCatalogAction.fulfilled, (state, { payload }) => {
        if (payload?.data) {
          state.roles = catalogsDto.list({
            data: payload.data,
            valueKey: firebaseCollectionsKey.role,
          });
        }
        state.processing = false;
      })
      .addCase(userCatalogAction.fulfilled, (state, { payload }) => {
        if (payload) {
          state.users = catalogsDto.listUser({
            data: payload,
            valueKey: firebaseCollectionsKey.user,
          });
        }
      })
      .addCase(paymentMethodCatalogAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(paymentMethodCatalogAction.rejected, (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      })
      .addCase(paymentMethodCatalogAction.fulfilled, (state, { payload }) => {
        if (payload?.data && !payload.isLocal) {
          state.cat_payment_method = catalogsDto.list({
            data: payload.data,
            valueKey: firebaseCollectionsKey.cat_payment_method,
          });
        }
        state.processing = false;
      })
      .addCase(catExpenseTypeCatalogAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(catExpenseTypeCatalogAction.rejected, (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      })
      .addCase(catExpenseTypeCatalogAction.fulfilled, (state, { payload }) => {
        if (payload?.data && !payload.isLocal) {
          state.cat_expense_type = catalogsDto.list({
            data: payload.data,
            valueKey: firebaseCollectionsKey.cat_expense_type,
          });
        }
        state.processing = false;
      })
      .addCase(catTruckloadLicensePlateCatalogAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(
        catTruckloadLicensePlateCatalogAction.rejected,
        (state, { payload }) => {
          state.error = payload.data;
          state.processing = false;
        }
      )
      .addCase(
        catTruckloadLicensePlateCatalogAction.fulfilled,
        (state, { payload }) => {
          if (payload?.data && !payload.isLocal) {
            state.cat_truckload_license_plate = catalogsDto.list({
              data: payload.data,
              valueKey: firebaseCollectionsKey.cat_truckload_license_plate,
            });
          }
          state.processing = false;
        }
      )
      .addCase(catRubroCatalogAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(catRubroCatalogAction.rejected, (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      })
      .addCase(catRubroCatalogAction.fulfilled, (state, { payload }) => {
        if (payload?.data && !payload.isLocal) {
          state.cat_rubro = catalogsDto.list({
            data: payload.data,
            valueKey: firebaseCollectionsKey.cat_rubro,
          });
        }
        state.processing = false;
      })
      .addCase(catLoanTypeCatalogAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(catLoanTypeCatalogAction.rejected, (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      })
      .addCase(catLoanTypeCatalogAction.fulfilled, (state, { payload }) => {
        if (payload?.data && !payload.isLocal) {
          state.cat_loan_type = catalogsDto.list({
            data: payload.data,
            valueKey: firebaseCollectionsKey.cat_loan_type,
          });
        }
        state.processing = false;
      });

    /* Insert New Option */
    builder.addCase(insertNewOptionAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(insertNewOptionAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(
      insertNewOptionAction.fulfilled,
      (state, { payload, meta }) => {
        const catalog = meta.arg.catalog;
        const list = catalogsDto.list({
          data: [payload],
          valueKey: firebaseCollectionsKey[catalog],
        });
        console.log({ catalog, list });
        state[catalog] = [...state[catalog], ...list];
        state.processing = false;
      }
    );
  },
});

export const { clearLastSelected, newOptionModalAction } =
  catalogsSlice.actions;

export default catalogsSlice.reducer;
