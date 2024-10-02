import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { authUrl, userUrl } from '@config/endpointConfig';
import { userDto } from '@dto';
import { convertToFormData, cryptoUtil } from '@utils';

const { callService } = useAxios();

export const userGetOneAction = createAsyncThunk(
  'settings/getUser',
  async ({ id_user }, { rejectWithValue }) => {
    return await callService({
      url: userUrl.getOne(id_user),
      errorCallback: rejectWithValue,
    }).get();
  }
);

export const updateUserAction = createAsyncThunk(
  'settings/update',
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

export const changePasswordAction = createAsyncThunk(
  'settings/changePassword',
  async ({ id_user, password }, { rejectWithValue }) => {
    const encryptBody = cryptoUtil.encryptString({ id_user, password });

    return await callService({
      url: authUrl.resetPassword,
      errorCallback: rejectWithValue,
    }).post({ data: encryptBody });
  }
);

const initialState = {
  selectedUser: null,
  currentModal: '',
  processing: false,
  loading: false,
};

export const userSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      state.selectedUser = action.payload;
    },
    setFormModalAction: (state, action) => {
      state.currentModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* User get one */
    builder.addCase(userGetOneAction.pending, (state) => {
      state.processing = true;
      state.loading = true;
    });
    builder.addCase(userGetOneAction.rejected, (state, action) => {
      state.processing = false;
      state.loading = false;
      state.error = action;
    });
    builder.addCase(
      userGetOneAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.selectedUser = userDto.get(payload.data);
        state.processing = false;
        state.loading = false;
      }
    );
    /* Update User */
    builder.addCase(updateUserAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(updateUserAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      updateUserAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedUser = userDto.get(payload.data);
        state.currentModal = '';
        state.processing = false;
        state.selectedUser = {
          ...state.selectedUser,
          ...updatedUser,
          updated: true, //if this flag exists, the user authentication context will be updated, this is only to read the update event
        };
      }
    );
    /* Change password */
    builder.addCase(changePasswordAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(changePasswordAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(changePasswordAction.fulfilled, (state) => {
      state.currentModal = ''; //close all modals
      state.processing = false;
    });
  },
});

export const { setUserAction, setFormModalAction } = userSlice.actions;

export default userSlice.reducer;
