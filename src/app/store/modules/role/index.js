import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleDto } from '@dto';
import {
  deleteRecordById,
  getAllDocuments,
  insertDocument,
  updateRecordBy,
} from '@utils/firebaseMethods';

export const createRoleAction = createAsyncThunk(
  'role/create',
  async (data, { rejectWithValue }) => {
    const body = roleDto.post(data);
    return await insertDocument({ collectionName: 'role', data: body })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const getOneAction = createAsyncThunk(
  'role/getOne',
  async ({ id }, { rejectWithValue }) => {
    return await getAllDocuments({ collectionName: 'role', docId: id })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const updateRoleAction = createAsyncThunk(
  'role/update',
  async (data, { rejectWithValue }) => {
    const body = roleDto.put(data);
    return await updateRecordBy({
      collectionName: 'role',
      filterBy: [{ field: 'id_role', condition: '==', value: body.id_role }],
      data: body,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const roleListAction = createAsyncThunk(
  'role/list',
  async (_, { rejectWithValue }) => {
    return await getAllDocuments({ collectionName: 'role' })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const deleteRoleAction = createAsyncThunk(
  'role/delete',
  async ({ id_role }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: 'role',
      filterBy: [{ field: 'id_role', condition: '==', value: id_role }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
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
    builder.addCase(createRoleAction.rejected, (state) => {
      console.error('error', state);
      state.processing = false;
    });
    builder.addCase(createRoleAction.fulfilled, (state, { payload }) => {
      const newRole = roleDto.get(payload);
      //set new role as selected
      state.selectedRole = roleDto.get(payload);
      //put new role into list
      state.roleList.unshift(newRole);
      state.processing = false;
    });
    /* update */
    builder.addCase(updateRoleAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(updateRoleAction.rejected, (state, action) => {
      console.error(action);

      state.error = action;
      state.processing = true;
    });
    builder.addCase(updateRoleAction.fulfilled, (state, { payload }) => {
      const updatedRole = roleDto.get(payload);
      const index = state.roleList.findIndex(
        (role) => role.id_role === updatedRole.id_role
      );
      state.roleList[index] = updatedRole;
      state.processing = false;
    });
    /* Get one */
    builder.addCase(getOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(getOneAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(getOneAction.fulfilled, (state, { payload }) => {
      state.selectedRole = roleDto.get(payload);
      state.processing = false;
    });
    /* Role list */
    builder.addCase(roleListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(roleListAction.rejected, (state, { payload }) => {
      console.log({ payload });
      state.processing = false;
    });
    builder.addCase(roleListAction.fulfilled, (state, { payload }) => {
      state.roleList = roleDto.get(payload.data);
      state.processing = false;
    });
    /* Delete */
    builder.addCase(deleteRoleAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(deleteRoleAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(deleteRoleAction.fulfilled, (state, { payload }) => {
      console.log('payload.ids[0]', payload.ids[0]);
      const id_role = payload.ids[0];
      state.roleList = state.roleList.filter(
        (role) => role.id_role !== id_role
      );
      state.processing = false;
      state.isModalOpen = false;
    });
  },
});

export const { setRoleAction, setModalOpenAction } = roleSlice.actions;

export default roleSlice.reducer;
