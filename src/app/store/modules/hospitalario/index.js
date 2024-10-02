import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { hospitlarioUrl } from '@config/endpointConfig';
import { hospitalarioDto } from '@dto';
import { cleanModel } from '@utils';
import { setLoadingMainViewAction } from '../main';

const { callService } = useAxios();

export const hospitalarioListAction = createAsyncThunk(
  'hospitalario/list',
  async (params, { rejectWithValue }) => {
    params = cleanModel(params);
    return await callService({
      url: hospitlarioUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params });
  }
);

export const hospitalarioListTodaysTotalAction = createAsyncThunk(
  'hospitalario/list-todays-total',
  async (params, { rejectWithValue }) => {
    params = cleanModel(params);
    return await callService({
      url: hospitlarioUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params });
  }
);

export const hospitalarioCreateAction = createAsyncThunk(
  'hospitalario/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    const parseData = hospitalarioDto.parseHospitalarioPutCreate(data);
    const body = cleanModel(parseData);
    return await callService({
      url: hospitlarioUrl.create,
      errorCallback: rejectWithValue,
    })
      .post(body)
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      });
  }
);

export const getOneHospitalarioAction = createAsyncThunk(
  'hospitalario/getOne',
  async ({ id, completeRecord = false }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await callService({
      url: hospitlarioUrl.getOne(id),
      errorCallback: rejectWithValue,
    })
      .get({ params: { completeRecord } })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      });
  }
);

export const getOneAllDetalleHospitalarioAction = createAsyncThunk(
  'hospitalario/getOneAllDetalle',
  async (
    { id, completeRecord = false },
    { rejectWithValue /* dispatch */ }
  ) => {
    return await callService({
      url: hospitlarioUrl.getOne(id),
      errorCallback: rejectWithValue,
    })
      .get({ params: { completeRecord } })
      .then((res) => {
        return res;
      });
  }
);

export const updateHospitalarioAction = createAsyncThunk(
  'hospitalario/update',
  async (data, { rejectWithValue }) => {
    const parseData = hospitalarioDto.parseHospitalarioPutCreate(data);
    const body = cleanModel(parseData);
    return await callService({
      url: hospitlarioUrl.put,
      errorCallback: rejectWithValue,
    }).put(body);
  }
);

export const tabHospitalarioDeleteAction = createAsyncThunk(
  'hospitalario/delete',
  async ({ id_services_record }, { rejectWithValue }) => {
    return await callService({
      url: hospitlarioUrl.delete(id_services_record),
      errorCallback: rejectWithValue,
    }).delete();
  }
);

export const hospitalarioClonarRegistro = createAsyncThunk(
  'hospitalario/clonar-registro',
  async (params, { rejectWithValue }) => {
    return await callService({
      url: hospitlarioUrl.clone(params.id_services_record),
      errorCallback: rejectWithValue,
    }).get({
      params: { id_service_type: params.id_service_type },
    });
  }
);

const initialState = {
  hospitalarioSelected: null,
  hospitalarioAllDetalleSelected: null,
  processing: false,
  processingGetDetalle: false,
  hospitalarioList: [],
  hospitalarioListTodaysTotal: [],
  totalItems: 5,
};

export const hospitalarioSlice = createSlice({
  name: 'hospitalario',
  initialState,
  reducers: {
    clearHospitalarioSelected: (state) => {
      state.hospitalarioSelected = null;
    },
    setNewGeneralTotal: (state, payload) => {
      state.hospitalarioSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(hospitalarioListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      hospitalarioListAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      hospitalarioListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.hospitalarioList = hospitalarioDto.listHospitalario(
          payload.data.data
        );
        state.totalItems = payload.data.totalItems;
        state.processing = false;
      }
    );

    /* SERVICIO TODAYS TOTAL LIST */
    builder.addCase(hospitalarioListTodaysTotalAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      hospitalarioListTodaysTotalAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      hospitalarioListTodaysTotalAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.hospitalarioListTodaysTotal = hospitalarioDto.listHospitalario(
          payload.data.data
        );
        state.processing = false;
      }
    );

    /* SERVICIO CREATE */
    builder.addCase(hospitalarioCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      hospitalarioCreateAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      hospitalarioCreateAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedHospitalario = hospitalarioDto.parseHospitalarioGetOne(
          payload.data
        );
        state.hospitalarioSelected = updatedHospitalario;
        state.processing = false;
      }
    );

    /* GET ONE */
    builder.addCase(getOneHospitalarioAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      getOneHospitalarioAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      getOneHospitalarioAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.hospitalarioSelected = hospitalarioDto.parseHospitalarioGetOne(
          payload.data
        );
        state.processing = false;
      }
    );
    /* GET ONE ALL DETALLE */
    builder.addCase(getOneAllDetalleHospitalarioAction.pending, (state) => {
      state.processingGetDetalle = true;
    });
    builder.addCase(
      getOneAllDetalleHospitalarioAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processingGetDetalle = false;
      }
    );
    builder.addCase(
      getOneAllDetalleHospitalarioAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.hospitalarioAllDetalleSelected =
          hospitalarioDto.parseHospitalarioGetOneAllDetalle(payload.data);
        state.processingGetDetalle = false;
      }
    );

    /* SERVICIO UPDATE */
    builder.addCase(updateHospitalarioAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      updateHospitalarioAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload?.payload?.data;
        state.processing = false;
      }
    );
    builder.addCase(
      updateHospitalarioAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedHospitalario = hospitalarioDto.parseHospitalarioGetOne(
          payload.data
        );
        state.hospitalarioSelected = updatedHospitalario;
        state.hospitalarioList = hospitalarioDto.updateListHospitalario(
          state.hospitalarioList,
          payload.data
        );
        state.processing = false;
      }
    );

    /* SERVICIO DELETE */
    builder.addCase(tabHospitalarioDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(tabHospitalarioDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      tabHospitalarioDeleteAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.hospitalarioList = state.hospitalarioList.filter(
          (honorario) => +honorario.id !== +payload.data.id_services_record
        );
        state.processing = false;
      }
    );

    /* SERVICIO CLONE */
    builder.addCase(hospitalarioClonarRegistro.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      hospitalarioClonarRegistro.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload?.payload?.data;
        state.processing = false;
      }
    );
    builder.addCase(
      hospitalarioClonarRegistro.fulfilled,
      (state, { payload: { payload } }) => {
        state.hospitalarioList = hospitalarioDto.updateListHospitalario(
          state.hospitalarioList,
          payload.data
        );
        state.processing = false;
      }
    );
  },
});

export const {
  clearHospitalarioSelected,
  setNewGeneralTotal,
  clearHospitalarioAllDetalleSelected,
} = hospitalarioSlice.actions;

export default hospitalarioSlice.reducer;
