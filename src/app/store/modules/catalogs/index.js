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

export const personCatalogAction = createAsyncThunk(
  'catalogs/person',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.person.length > 0) {
      return { data: state.catalogs.person };
    }
    return await getAllDocuments({
      collectionName: firebaseCollections.PERSON,
      nonReferenceField: firebaseCollectionsKey.person,
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

export const paidMethodCatalogAction = createAsyncThunk(
  'catalogs/paid-method',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.catalogs.paidMethod.length > 0) {
      return { data: state.catalogs.paidMethod };
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
    if (state.catalogs.catExpenseType.length > 0) {
      return { data: state.catalogs.catExpenseType };
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
    if (state.catalogs.catTruckloadLicensePlate.length > 0) {
      return {
        data: state.catalogs.catTruckloadLicensePlate,
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

const initialState = {
  processing: false,
  roles: [],
  users: [],
  person: [],
  paidMethod: [],
  catExpenseType: [],
  catTruckloadLicensePlate: [],
};

export const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {
    clearLastSelected: (state) => {
      // This reducer is kept as it might be used elsewhere
      state.lastCategory = null;
      state.lastMeasureType = null;
      state.lastProvider = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(rolesCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(rolesCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(rolesCatalogAction.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        state.roles = catalogsDto.list({
          data: payload.data,
          valueKey: 'id_role',
        });
      }
      state.processing = false;
    });

    builder.addCase(personCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(personCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(personCatalogAction.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        state.person = catalogsDto.list({
          data: payload.data,
          valueKey: 'id_person',
        });
      }
      state.processing = false;
    });

    builder.addCase(userCatalogAction.fulfilled, (state, { payload }) => {
      if (payload) {
        state.users = catalogsDto.listUser({
          data: payload,
          valueKey: 'id_user',
        });
      }
    });

    builder.addCase(paidMethodCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(paidMethodCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(paidMethodCatalogAction.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        state.paidMethod = catalogsDto.list({
          data: payload.data,
          valueKey: 'id_cat_payment_method',
        });
      }
      state.processing = false;
    });

    builder.addCase(catExpenseTypeCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      catExpenseTypeCatalogAction.rejected,
      (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );

    builder.addCase(
      catExpenseTypeCatalogAction.fulfilled,
      (state, { payload }) => {
        if (payload?.data) {
          state.catExpenseType = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_cat_expense_type',
          });
        }
      }
    );

    builder.addCase(catTruckloadLicensePlateCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      catTruckloadLicensePlateCatalogAction.rejected,
      (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      catTruckloadLicensePlateCatalogAction.fulfilled,
      (state, { payload }) => {
        if (payload?.data) {
          if (!payload.isLocal) {
            state.catTruckloadLicensePlate = catalogsDto.list({
              data: payload.data,
              valueKey: 'id_cat_truckload_license_plate',
            });
          }
        }
        state.processing = false;
      }
    );
  },
});

export const { clearLastSelected } = catalogsSlice.actions;

export default catalogsSlice.reducer;
