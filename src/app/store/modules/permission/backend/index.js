import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { permissionlUrl } from '@config/endpointConfig';
import { permissionDto } from '@dto';

const { callService } = useAxios();

export const permissionListAction = createAsyncThunk(
  'permission/list',
  async ({ id_role, id_subject }, { rejectWithValue }) => {
    return await callService({
      url: permissionlUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params: { id_role, id_subject } });
  }
);

export const permissionCreateOrUpdateAction = createAsyncThunk(
  'permission/createOrUpdate',
  async (permission, { rejectWithValue }) => {
    const body = permissionDto.put(permission);
    return await callService({
      url: permissionlUrl.updateOrCreate,
      errorCallback: rejectWithValue,
    }).put(body);
  }
);

const initialState = {
  processing: false,
  selectedPermission: null,
  permissionList: [],
};

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermissionListAction: (state, action) => {
      state.permissionList = action.payload;
    },
    setPermissionAction: (state, action) => {
      state.selectedPermission = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(permissionListAction.pending, (state) => {
      state.processing = true;
      state.permissionList = [];
    });
    builder.addCase(
      permissionListAction.rejected,
      (state, { payload: { payload } }) => {
        console.log({ payload });
        state.processing = false;
      }
    );
    builder.addCase(
      permissionListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.permissionList = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(permissionCreateOrUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      permissionCreateOrUpdateAction.rejected,
      (state, { payload: { payload } }) => {
        console.log({ payload });
        state.processing = false;
      }
    );
    builder.addCase(
      permissionCreateOrUpdateAction.fulfilled,
      (state, { payload: { payload } }) => {
        const { id_action, id_permission, isActive } = payload.data;
        const index = state.permissionList.findIndex(
          (permission) => +permission.id_action === +id_action
        );
        if (index !== -1) {
          state.permissionList[index].isActive = isActive;
          state.permissionList[index].id_permission = id_permission;
        }
        state.selectedPermission.id_permission = id_permission;
        state.processing = false;
      }
    );
  },
});

export const { setPermissionListAction, setPermissionAction } =
  permissionSlice.actions;

export default permissionSlice.reducer;
