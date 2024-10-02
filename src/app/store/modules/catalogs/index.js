import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { catalogsDto } from '@dto';
import { getDataFrom, insertInto } from '@utils/firebaseMethods';
import { firebaseFilterBuilder } from '@utils';

export const rolesCatalogAction = createAsyncThunk(
  'catalogs/roles',
  async (params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: 'role',
      filterBy: [{ field: 'isActive', condition: '==', value: true }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const serviceTypeCatalogAction = createAsyncThunk(
  'catalogs/service-type',
  async (params, { rejectWithValue }) => {
    return await getDataFrom({ collectionName: 'catServiceType' })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const conditionNotesCatalogAction = createAsyncThunk(
  'catalogs/conditionNotes',
  async (params, { rejectWithValue }) => {
    return await getDataFrom({ collectionName: 'catConditionNotes' })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const statusRecordCatalogAction = createAsyncThunk(
  'catalogs/status-record',
  async (params, { rejectWithValue }) => {
    return await getDataFrom({ collectionName: 'catStatusRecord' })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const personCatalogAction = createAsyncThunk(
  'catalogs/person',
  async (params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: 'person',
      nonReferenceField: 'id_person',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
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
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(params);
    return await getDataFrom({
      collectionName: 'provider',
      filterBy,
      nonReferenceField: 'id_provider',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const personTypeCatalogAction = createAsyncThunk(
  'catalogs/person-type',
  async (params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: 'person_type',
      nonReferenceField: 'id_person_type',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const genderCatalogAction = createAsyncThunk(
  'catalogs/gender',
  async (params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: 'gender',
      nonReferenceField: 'id_gender',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const productMeasureTypeCatalogAction = createAsyncThunk(
  'catalogs/product-measure',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(params);

    return await getDataFrom({
      collectionName: 'product_measure_type',
      filterBy,
      nonReferenceField: 'id_product_measure_type',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const insertproviderCatalogAction = createAsyncThunk(
  'catalogs/provider/insert',
  async (data, { rejectWithValue }) => {
    const body = catalogsDto.postProvider(data);
    return await insertInto({
      collectionName: 'provider',
      data: body,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const categoryCatalogAction = createAsyncThunk(
  'catalogs/category',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(params);

    return await getDataFrom({
      collectionName: 'category',
      filterBy,
      nonReferenceField: 'id_category',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const insertCategoryCatalogAction = createAsyncThunk(
  'catalogs/category/insert',
  async (data, { rejectWithValue }) => {
    const body = catalogsDto.postCatagory(data);
    return await insertInto({
      collectionName: 'category',
      data: body,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const insertProductMeasureTypeCatalogAction = createAsyncThunk(
  'catalogs/product-measure/insert',
  async (data, { rejectWithValue }) => {
    const body = catalogsDto.postProductMeasureType(data);
    return await insertInto({
      collectionName: 'product_measure_type',
      data: body,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
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
    /* CATALOGO DE TIPOS DE SERVICIO (CONSULTA/HOSPITALIZACIÓN) */
    builder.addCase(serviceTypeCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(serviceTypeCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(
      serviceTypeCatalogAction.fulfilled,
      (state, { payload }) => {
        if (payload?.data) {
          state.serviceType = catalogsDto.list({
            data: payload.data,
            valueKey: 'id_service_type',
          });
        }
        state.processing = false;
      }
    );
    /* CATALOGO DE Condiciiones */
    builder.addCase(conditionNotesCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      conditionNotesCatalogAction.rejected,
      (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      conditionNotesCatalogAction.fulfilled,
      (state, { payload }) => {
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
      (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      statusRecordCatalogAction.fulfilled,
      (state, { payload }) => {
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

    /* CATALOGO TIPO DE LABORATORIO NECESARIO PARA LA CREACIÓN DE UN PRODUCTO DE FARMACIA */
    builder.addCase(providerCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(providerCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(providerCatalogAction.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        const values = catalogsDto.getProvider(payload.data);
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
    });
    /* Insert */
    builder.addCase(insertproviderCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      insertproviderCatalogAction.rejected,
      (state, { payload }) => {
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      insertproviderCatalogAction.fulfilled,
      (state, { payload }) => {
        if (payload) {
          const newItem = {
            value: payload.id_provider,
            label: payload.name,
          };
          state.lastProvider = {
            value: payload.id_provider,
            label: payload.name,
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
      (state, { payload }) => {
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      insertCategoryCatalogAction.fulfilled,
      (state, { payload }) => {
        if (payload) {
          const newItem = {
            value: payload.id_category,
            label: payload.name,
          };
          state.lastCategory = {
            value: payload.id_category,
            label: payload.name,
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
      (state, { payload }) => {
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      insertProductMeasureTypeCatalogAction.fulfilled,
      (state, { payload }) => {
        if (payload) {
          const newItem = {
            value: payload.id_product_measure_type,
            label: payload.name,
            validation_id: payload.validation_id ?? 0,
          };
          state.lastMeasureType = {
            value: payload.id_product_measure_type,
            label: payload.name,
            validation_id: payload.validation_id ?? 0,
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
    builder.addCase(personTypeCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(personTypeCatalogAction.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        state.personType = catalogsDto.list({
          data: payload.data,
          valueKey: 'id_person_type',
        });
      }
      state.processing = false;
    });
    /* CATALOGO GENERO */
    builder.addCase(genderCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(genderCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(genderCatalogAction.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        state.gender = catalogsDto.list({
          data: payload.data,
          valueKey: 'id_gender',
        });
      }
      state.processing = false;
    });
    /* ProductMeasure  */
    builder.addCase(productMeasureTypeCatalogAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      productMeasureTypeCatalogAction.rejected,
      (state, { payload }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      productMeasureTypeCatalogAction.fulfilled,
      (state, { payload }) => {
        if (payload?.data) {
          state.productMeasureType = catalogsDto.listProductMeasure({
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
    builder.addCase(categoryCatalogAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(categoryCatalogAction.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        state.category = catalogsDto.list({
          data: payload.data,
          valueKey: 'id_category',
        });
      }
      state.processing = false;
    });
  },
});

export const { catalogs, clearLastSelected } = catalogsSlice.actions;

export default catalogsSlice.reducer;
