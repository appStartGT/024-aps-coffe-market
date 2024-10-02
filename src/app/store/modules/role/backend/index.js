import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { roleUrl } from '@config/endpointConfig';
import { roleDto } from '@dto';
import { setLoadingMainViewAction } from '../../main';

const { callService } = useAxios();

export const createRoleAction = createAsyncThunk(
  'role/create',
  async (data, { rejectWithValue }) => {
    const body = roleDto.post(data);
    return await callService({
      url: roleUrl.create,
      errorCallback: rejectWithValue,
    }).post(body);
  }
);

export const getOneAction = createAsyncThunk(
  'role/getOne',
  async ({ id }, { rejectWithValue }) => {
    setLoadingMainViewAction(true);
    return await callService({
      url: roleUrl.getOne(id),
      errorCallback: rejectWithValue,
    })
      .get()
      .then((res) => {
        setLoadingMainViewAction(false);
        return res;
      });
  }
);

export const updateRoleAction = createAsyncThunk(
  'role/update',
  async (data, { rejectWithValue }) => {
    const body = roleDto.put(data);
    return await callService({
      url: roleUrl.put,
      errorCallback: rejectWithValue,
    }).put(body);
  }
);

export const roleListAction = createAsyncThunk(
  'role/list',
  async (params, { rejectWithValue }) => {
    return await callService({
      url: roleUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params });
  }
);

export const deleteRoleAction = createAsyncThunk(
  'role/delete',
  async ({ id_role }, { rejectWithValue }) => {
    return await callService({
      url: roleUrl.delete(id_role),
      errorCallback: rejectWithValue,
    }).delete();
  }
);

const initialState = {
  selectedRole: null,
  processing: false,
  isModalOpen: false,
  roleList: [],
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoleAction: (state, action) => {
      state.selectedRole = action.payload;
    },
    setModalOpenAction: (state, action) => {
      state.isModalOpen = action.payload;
    },
  },
  /* Create */
  extraReducers: (builder) => {
    builder.addCase(createRoleAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      createRoleAction.fulfilled,
      (state, { payload: { payload } }) => {
        const newRole = roleDto.get(payload.data);
        //set new role as selected
        state.selectedRole = roleDto.get(payload.data);
        //put new role into list
        state.roleList.unshift(newRole);
        state.processing = false;
      }
    );
    /* update */
    builder.addCase(updateRoleAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      updateRoleAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedRole = roleDto.get(payload.data);
        const index = state.roleList.findIndex(
          (role) => role.id_role === updatedRole.id_role
        );
        state.roleList[index] = updatedRole;
        state.processing = false;
      }
    );
    /* Get one */
    builder.addCase(getOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      getOneAction.rejected,
      (state, { payload: { payload } }) => {
        state.error = payload.data;
        state.processing = false;
      }
    );
    builder.addCase(
      getOneAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.selectedRole = roleDto.get(payload.data);
        state.processing = false;
      }
    );
    /* Role list */
    builder.addCase(roleListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      roleListAction.rejected,
      (state, { payload: { payload } }) => {
        console.log({ payload });
        state.processing = false;
      }
    );
    builder.addCase(
      roleListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.roleList = roleDto.get(payload.data);
        state.processing = false;
      }
    );
    /* Delete */
    builder.addCase(deleteRoleAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(deleteRoleAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      deleteRoleAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.roleList = state.roleList.filter(
          (role) => +role.id_role !== +payload.data.id_role
        );
        state.processing = false;
        state.isModalOpen = false;
      }
    );
  },
});

export const { setRoleAction, setModalOpenAction } = roleSlice.actions;

export default roleSlice.reducer;
