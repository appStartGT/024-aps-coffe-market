import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { organizationUrl } from '@config/endpointConfig';
import { organizationDto } from '@dto';
import { cleanModel, convertToFormData } from '@utils';
import { setLoadingMainViewAction } from '../main';

const { callService } = useAxios();

export const organizationListAction = createAsyncThunk(
  'organization/list',
  async (params, { rejectWithValue }) => {
    params = cleanModel(params);
    return await callService({
      url: organizationUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params });
  }
);

export const organizationCreateAction = createAsyncThunk(
  'organization/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);
    body = convertToFormData(body);
    return await callService({
      url: organizationUrl.create,
      errorCallback: rejectWithValue,
    })
      .post(body)
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      });
  }
);

export const organizationGetOneAction = createAsyncThunk(
  'organization/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await callService({
      url: organizationUrl.getOne(id),
      errorCallback: rejectWithValue,
    })
      .get()
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      });
  }
);

export const getOneAllDetalleHospitalarioAction = createAsyncThunk(
  'organization/getOneAllDetalle',
  async (
    { id, completeRecord = false },
    { rejectWithValue /* dispatch */ }
  ) => {
    return await callService({
      url: organizationUrl.getOne(id),
      errorCallback: rejectWithValue,
    })
      .get({ params: { completeRecord } })
      .then((res) => {
        return res;
      });
  }
);

export const organizationUpdateAction = createAsyncThunk(
  'organization/update',
  async (data, { rejectWithValue }) => {
    let body = organizationDto.organizationPut(data);
    body = convertToFormData(body);
    return await callService({
      url: organizationUrl.put,
      errorCallback: rejectWithValue,
    }).put(body);
  }
);

export const organizationDeleteAction = createAsyncThunk(
  'organization/delete',
  async ({ id_organization }, { rejectWithValue }) => {
    return await callService({
      url: organizationUrl.delete(id_organization),
      errorCallback: rejectWithValue,
    }).delete();
  }
);

const initialState = {
  organizationSelected: null,
  processing: false,
  organizationList: [],
  totalItems: 5,
};

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearOrganizationSelected: (state) => {
      state.organizationSelected = null;
    },
    setNewGeneralTotal: (state, payload) => {
      state.organizationSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(organizationListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      organizationListAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      organizationListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.organizationList = organizationDto.organizationList(
          payload.data.data
        );
        state.totalItems = payload.data.totalItems;
        state.processing = false;
      }
    );

    /*  CREATE */
    builder.addCase(organizationCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      organizationCreateAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      organizationCreateAction.fulfilled,
      (state, { payload: { payload } }) => {
        const organization = organizationDto.organizationGetOne(payload.data);
        state.organizationSelected = organization;
        state.processing = false;
      }
    );
    /* GET ONE */
    builder.addCase(organizationGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      organizationGetOneAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      organizationGetOneAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.organizationSelected = organizationDto.organizationGetOne(
          payload.data
        );
        state.processing = false;
      }
    );

    /* SERVICIO UPDATE */
    builder.addCase(organizationUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      organizationUpdateAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload?.payload?.data;
        state.processing = false;
      }
    );
    builder.addCase(
      organizationUpdateAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedOrganization = organizationDto.organizationGetOne(
          payload.data
        );
        state.organizationSelected = updatedOrganization;
        state.organizationList = organizationDto.updateListOrganization(
          state.organizationList,
          payload.data
        );
        state.processing = false;
      }
    );

    /*  DELETE */
    builder.addCase(organizationDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(organizationDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      organizationDeleteAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.organizationList = state.organizationList.filter(
          (org) => +org.id !== +payload.data.id_organization
        );
        state.processing = false;
      }
    );
  },
});

export const { clearOrganizationSelected } = organizationSlice.actions;

export default organizationSlice.reducer;
