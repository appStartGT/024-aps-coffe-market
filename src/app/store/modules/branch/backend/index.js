import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { branchUrl } from '@config/endpointConfig';
import { branchDto } from '@dto';
import { cleanModel, convertToFormData } from '@utils';
import { setLoadingMainViewAction } from '../main';

const { callService } = useAxios();

export const branchListAction = createAsyncThunk(
  'branch/list',
  async (params, { rejectWithValue }) => {
    params = cleanModel(params);
    return await callService({
      url: branchUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params });
  }
);

export const branchCreateAction = createAsyncThunk(
  'branch/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);
    body = convertToFormData(body);
    return await callService({
      url: branchUrl.create,
      errorCallback: rejectWithValue,
    })
      .post(body)
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      });
  }
);

export const branchGetOneAction = createAsyncThunk(
  'branch/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await callService({
      url: branchUrl.getOne(id),
      errorCallback: rejectWithValue,
    })
      .get()
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      });
  }
);

export const branchUpdateAction = createAsyncThunk(
  'branch/update',
  async (data, { rejectWithValue }) => {
    let body = branchDto.organizationPut(data);
    body = convertToFormData(body);
    return await callService({
      url: branchUrl.put,
      errorCallback: rejectWithValue,
    }).put(body);
  }
);

export const branchDeleteAction = createAsyncThunk(
  'branch/delete',
  async ({ id_branch }, { rejectWithValue }) => {
    return await callService({
      url: branchUrl.delete(id_branch),
      errorCallback: rejectWithValue,
    }).delete();
  }
);

const initialState = {
  branchSelected: null,
  processing: false,
  branchList: [],
  totalItems: 5,
};

export const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    clearBranchSelected: (state) => {
      state.branchSelected = null;
    },
    setNewGeneralTotal: (state, payload) => {
      state.branchSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(branchListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      branchListAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      branchListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.branchList = branchDto.branchList(payload.data.data);
        state.totalItems = payload.data.totalItems;
        state.processing = false;
      }
    );

    /*  CREATE */
    builder.addCase(branchCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      branchCreateAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      branchCreateAction.fulfilled,
      (state, { payload: { payload } }) => {
        const organization = branchDto.branchGetOne(payload.data);
        state.branchSelected = organization;
        state.processing = false;
      }
    );
    /* GET ONE */
    builder.addCase(branchGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      branchGetOneAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      branchGetOneAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.branchSelected = branchDto.branchGetOne(payload.data);
        state.processing = false;
      }
    );

    /* SERVICIO UPDATE */
    builder.addCase(branchUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      branchUpdateAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload?.payload?.data;
        state.processing = false;
      }
    );
    builder.addCase(
      branchUpdateAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedOrganization = branchDto.branchGetOne(payload.data);
        state.branchSelected = updatedOrganization;
        state.branchList = branchDto.updateListBranch(
          state.branchList,
          payload.data
        );
        state.processing = false;
      }
    );

    /*  DELETE */
    builder.addCase(branchDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(branchDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      branchDeleteAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.branchList = state.branchList.filter(
          (org) => +org.id !== +payload.data.id_branch
        );
        state.processing = false;
      }
    );
  },
});

export const { clearBranchSelected } = branchSlice.actions;

export default branchSlice.reducer;
