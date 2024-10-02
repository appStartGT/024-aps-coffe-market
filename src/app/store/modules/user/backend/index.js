import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { userUrl } from '@config/endpointConfig';
import { userDto } from '@dto';
import { convertToFormData } from '@utils';

const { callService } = useAxios();

export const userListAction = createAsyncThunk(
  'user/list',
  async (params, { rejectWithValue }) => {
    return await callService({
      url: userUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params });
  }
);

export const createUserAction = createAsyncThunk(
  'user/create',
  async (data, { rejectWithValue }) => {
    const _data = userDto.post(data);
    const body = convertToFormData(_data); //send as form data

    return await callService({
      url: userUrl.create,
      errorCallback: rejectWithValue,
    }).post(body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
);

export const updateUserAction = createAsyncThunk(
  'user/update',
  async (data, { rejectWithValue }) => {
    const _data = userDto.put(data);
    const body = convertToFormData(_data); //send as form data

    return await callService({
      url: userUrl.update,
      errorCallback: rejectWithValue,
    }).put(body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
);

export const deleteUserAction = createAsyncThunk(
  'user/delete',
  async ({ id_user }, { rejectWithValue }) => {
    return await callService({
      url: userUrl.delete(id_user),
      errorCallback: rejectWithValue,
    }).delete();
  }
);

export const setUserThemeAction = createAsyncThunk(
  'user/setUserTheme',
  async (data, { rejectWithValue }) => {
    return await callService({
      url: userUrl.theme,
      errorCallback: rejectWithValue,
    }).post(data);
  }
);

const initialState = {
  userList: [],
  selectedUser: undefined,
  isUserModalOpen: false,
  isDeleteModalOpen: false,
  processing: false,
  actionStatus: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUserModalAction: (state, action) => {
      state.isUserModalOpen = action.payload;
    },
    setDeleteModalAction: (state, action) => {
      state.isDeleteModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* User list */
    builder.addCase(userListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(userListAction.rejected, (state, action) => {
      console.log(action);
      state.processing = false;
    });
    builder.addCase(
      userListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.userList = userDto.get(payload.data);
        state.processing = false;
      }
    );
    /* Create User */
    builder.addCase(createUserAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(createUserAction.rejected, (state, action) => {
      console.log(action);
      state.processing = false;
    });
    builder.addCase(
      createUserAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.userList.unshift(userDto.get(payload.data));
        state.isUserModalOpen = false;
        state.processing = false;
        state.selectedUser = {};
      }
    );
    /* Update User */
    builder.addCase(updateUserAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(updateUserAction.rejected, (state, action) => {
      console.log('action', action);
      state.processing = false;
    });
    builder.addCase(
      updateUserAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedUser = userDto.get(payload.data);
        const index = state.userList.findIndex(
          (user) => +user.id_user === +updatedUser.id_user
        );
        state.userList[index] = { ...state.userList[index], ...updatedUser };
        state.isUserModalOpen = false;
        state.processing = false;
        state.selectedUser = undefined;
      }
    );
    /* Delete */
    builder.addCase(deleteUserAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(deleteUserAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      deleteUserAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.userList = state.userList.filter(
          (user) => +user.id_user !== +payload.data.id_user
        );
        state.processing = false;
        state.isDeleteModalOpen = false;
        state.selectedUser = null;
      }
    );
    /* set user theme */
    builder.addCase(setUserThemeAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(setUserThemeAction.rejected, (state, action) => {
      console.log('action', action);
      state.processing = false;
    });
    builder.addCase(
      setUserThemeAction.fulfilled,
      (state /* , { payload: { payload } } */) => {
        state.processing = false;
      }
    );
  },
});

export const { setUserAction, setUserModalAction, setDeleteModalAction } =
  userSlice.actions;

export default userSlice.reducer;
