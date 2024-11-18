import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { catalogsDto } from '@dto';
import { getAllDocuments } from '@utils/firebaseMethods';
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
    if (state.catalogs.cat_truckload_licenseplate.length > 0) {
      return {
        data: state.catalogs.cat_truckload_licenseplate,
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

const initialState = {
  processing: false,
  roles: [],
  users: [],
  person: [],
  cat_payment_method: [],
  cat_expense_type: [],
  cat_truckload_licenseplate: [],
  cat_rubro: [],
  cat_loan_type: [],
};

export const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {
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
            state.cat_truckload_licenseplate = catalogsDto.list({
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
  },
});

export const { clearLastSelected } = catalogsSlice.actions;

export default catalogsSlice.reducer;
