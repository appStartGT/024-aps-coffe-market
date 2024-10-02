import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { catalogUrl, roleUrl } from '@config/endpointConfig';
import { catalogsDto } from '@dto';

const { callService } = useAxios();

export const rolesCatalogAction = createAsyncThunk(
  'catalogs/roles',
  async (params, { rejectWithValue }) => {
    return await callService({
      url: roleUrl.list,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const serviceTypeCatalogAction = createAsyncThunk(
  'catalogs/service-type',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.serviceType,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const symptomCatalogAction = createAsyncThunk(
  'catalogs/conditionNotes',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.conditionNotes,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const statusRecordCatalogAction = createAsyncThunk(
  'catalogs/status-record',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.statusRecord,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const personCatalogAction = createAsyncThunk(
  'catalogs/person',
  async (params, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.person,
      errorCallback: rejectWithValue,
    }).get({
      params,
    });
  }
);

export const userCatalogAction = createAsyncThunk(
  'catalogs/user',
  async (_, { getState }) => {
    const state = getState();
    return state.user.userList;
  }
);

export const providerCatalogAction = createAsyncThunk(
  'catalogs/provider',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.provider,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const personTypeCatalogAction = createAsyncThunk(
  'catalogs/person-type',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.personType,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const genderCatalogAction = createAsyncThunk(
  'catalogs/gender',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.gender,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const productMeasureTypeCatalogAction = createAsyncThunk(
  'catalogs/product-measure',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.productMeasureType,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const insertproviderCatalogAction = createAsyncThunk(
  'catalogs/provider/insert',
  async (data, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.createProvider,
      errorCallback: rejectWithValue,
    }).post(data);
  }
);

export const categoryCatalogAction = createAsyncThunk(
  'catalogs/category',
  async (param, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.category,
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const insertCategoryCatalogAction = createAsyncThunk(
  'catalogs/category/insert',
  async (data, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.createCategory,
      errorCallback: rejectWithValue,
    }).post(data);
  }
);

export const insertProductMeasureTypeCatalogAction = createAsyncThunk(
  'catalogs/product-measure/insert',
  async (data, { rejectWithValue }) => {
    return await callService({
      url: catalogUrl.createProductMeasureType,
      errorCallback: rejectWithValue,
    }).post(data);
  }
);

const initialState = {
  processing: false,
  roles: [],
  users: [],
  serviceType: [],
  clientNotes: [],
  statusRecord: [],
  person: [],
  provider: [],
  personType: [],
  gender: [],
  productMeasureType: [],
  category: [],
  lastCategory: '',
  lastMeasureType: '',
  lastProvider: '',
};

export const catalogsSlice = createSlice({
  name: 'catalogs',
  initialState,
  reducers: {
    application: (state, action) => {
      state.test = action.payload;
    },
    clearLastSelected: (state /* action */) => {
      state.lastCategory = null;
      state.lastMeasureType = null;
      state.lastProvider = null;
    },
  },
  extraReducers: (builder) => {
    /* ROLE CATALOG LIST */
    builder.addCase(rolesCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      rolesCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      rolesCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.roles = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_role',
          });
        }
        state.processing = false;
      }
    );
    /* CATALOGO DE TIPOS DE SERVICIO (CONSULTA/HOSPITALIZACIÓN) */
    builder.addCase(serviceTypeCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      serviceTypeCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      serviceTypeCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.serviceType = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_service_type',
          });
        }
        state.processing = false;
      }
    );
    /* CATALOGO DE SINTOMAS */
    builder.addCase(symptomCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      symptomCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      symptomCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.clientNotes = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_condition_notes',
          });
        }
        state.processing = false;
      }
    );

    /* CATALOGO DE ESTADOS PARA EL REGISTRO SERVICIO */
    builder.addCase(statusRecordCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      statusRecordCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      statusRecordCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.statusRecord = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_status',
          });
        }
        state.processing = false;
      }
    );

    /* CATALOGO DE ESTADOS PARA EL REGISTRO SERVICIO */
    builder.addCase(personCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      personCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      personCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.person = catalogsDto.listPerson({
            data: payload.data.data,
            valueKey: 'id_person',
          });
        }
        state.processing = false;
      }
    );

    /* CATALOGO TIPO DE LABORATORIO NECESARIO PARA LA CREACIÓN DE UN PRODUCTO DE FARMACIA */
    builder.addCase(providerCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      providerCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      providerCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          const values = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_provider',
          });
          //sort data alphabetically
          state.provider = values.sort((a, b) => {
            if (a.label < b.label) {
              return -1;
            }
            if (a.label > b.label) {
              return 1;
            }
            return 0;
          });
        }
        state.processing = false;
      }
    );
    /* Insert */
    builder.addCase(insertproviderCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      insertproviderCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      insertproviderCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          const newItem = {
            value: payload.data.id_provider,
            label: payload.data.name,
          };
          state.lastProvider = {
            value: payload.data.id_provider,
            label: payload.data.name,
          };

          state.provider = [newItem, ...state.provider];

          state.provider = state.provider.sort((a, b) => {
            const labelA = a.label.toLowerCase();
            const labelB = b.label.toLowerCase();

            return labelA.localeCompare(labelB);
          });
        }
        state.processing = false;
      }
    );

    /* Insert Category */
    builder.addCase(insertCategoryCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      insertCategoryCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      insertCategoryCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          const newItem = {
            value: payload.data.id_category,
            label: payload.data.name,
          };
          state.lastCategory = {
            value: payload.data.id_category,
            label: payload.data.name,
          };

          state.category = [newItem, ...state.category];

          state.category = state.category.sort((a, b) => {
            const labelA = a.label.toLowerCase();
            const labelB = b.label.toLowerCase();

            return labelA.localeCompare(labelB);
          });
        }
        state.processing = false;
      }
    );

    /* Insert PRODUCT measure type */
    builder.addCase(insertProductMeasureTypeCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      insertProductMeasureTypeCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      insertProductMeasureTypeCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          const newItem = {
            value: payload.data.id_product_measure_type,
            label: payload.data.name,
          };
          state.lastMeasureType = {
            value: payload.data.id_product_measure_type,
            label: payload.data.name,
          };

          state.productMeasureType = [newItem, ...state.productMeasureType];

          state.productMeasureType = state.productMeasureType.sort((a, b) => {
            const labelA = a.label.toLowerCase();
            const labelB = b.label.toLowerCase();

            return labelA.localeCompare(labelB);
          });
        }
        state.processing = false;
      }
    );

    /* CATALOGO DE USUARIOS, NO LLAMA AL API USA LOS VALORES PRECARGADOS*/
    builder.addCase(userCatalogAction.fulfilled, (state, { payload }) => {
      if (payload) {
        state.users = catalogsDto.listUser({
          data: payload,
          valueKey: 'id_user',
        });
      }
    });
    /* CATALAGO DE TIPO DE PERSONAS */
    builder.addCase(personTypeCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      personTypeCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      personTypeCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.personType = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_person_type',
          });
        }
        state.processing = false;
      }
    );
    /* CATALOGO GENERO */
    builder.addCase(genderCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      genderCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      genderCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.gender = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_gender',
          });
        }
        state.processing = false;
      }
    );
    /* ProductMeasure  */
    builder.addCase(productMeasureTypeCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      productMeasureTypeCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      productMeasureTypeCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.productMeasureType = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_product_measure_type',
          });
        }
        state.processing = false;
      }
    );

    /* category  */
    builder.addCase(categoryCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      categoryCatalogAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      categoryCatalogAction.fulfilled,
      (state, { payload: { payload } }) => {
        if (payload?.data) {
          state.category = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_category',
          });
        }
        state.processing = false;
      }
    );
  },
});

export const { catalogs, clearLastSelected } = catalogsSlice.actions;

export default catalogsSlice.reducer;
