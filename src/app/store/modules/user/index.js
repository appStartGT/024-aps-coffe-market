import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userDto } from '@dto';
import Firebase from '@config/firebaseConfig';
import {
  deleteRecordById,
  getDataFrom,
  insertInto,
  updateRecordBy,
  uploadFile,
} from '@utils/firebaseMethods';
import { cleanModel, firebaseFilterBuilder } from '@utils';

export const userListAction = createAsyncThunk(
  'user/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(cleanModel(params));
    return await getDataFrom({
      collectionName: 'user',
      filterBy,
      nonReferenceField: 'id_user',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const createUserAction = createAsyncThunk(
  'user/create',
  async (data, { rejectWithValue }) => {
    try {
      const _data = userDto.post(data);
      // Create user with Firebase Authentication
      const userCredential =
        await Firebase.auth().createUserWithEmailAndPassword(
          _data.email,
          _data.password
        );
      const user = userCredential.user;

      let photoData = {};
      if (_data.photo) {
        let photoUrl = await uploadFile({
          file: _data.photo,
          path: 'profile_photos',
        });
        let photoMetadata = {
          name: _data.photo.name,
          size: _data.photo.size,
          type: _data.photo.type,
        };
        photoData = { photo: photoUrl, photoMetadata };
      }

      const userData = {
        id: user.uid,
        key: 'id_user',
        ..._data,
        ...photoData,
      };

      const response = await insertInto({
        collectionName: 'user',
        data: userData,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserAction = createAsyncThunk(
  'user/update',
  async (data, { rejectWithValue }) => {
    const _data = userDto.put(data);

    let photoData = {};
    if (typeof _data.photo == 'object') {
      let photoUrl = await uploadFile({
        file: _data.photo,
        path: 'profile_photos',
      });
      let photoMetadata = {
        name: _data.photo.name,
        size: _data.photo.size,
        type: _data.photo.type,
      };

      photoData = { photo: photoUrl, photoMetadata };
    }

    const userData = {
      ..._data,
      ...photoData,
    };

    return await updateRecordBy({
      collectionName: 'user',
      filterBy: [{ field: 'id_user', condition: '==', value: _data.id_user }],
      data: cleanModel(userData),
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const deleteUserAction = createAsyncThunk(
  'user/delete',
  async ({ id_user }, { rejectWithValue }) => {
    // await Firebase.auth().updateUser(id_user, {
    //   disabled: true,
    // });
    return await deleteRecordById({
      collectionName: 'user',
      filterBy: [{ field: 'id_user', condition: '==', value: id_user }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
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
    builder.addCase(userListAction.fulfilled, (state, { payload }) => {
      state.userList = userDto.get(payload.data);
      state.processing = false;
    });
    /* Create User */
    builder.addCase(createUserAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(createUserAction.rejected, (state, action) => {
      console.log(action);
      state.processing = false;
    });
    builder.addCase(createUserAction.fulfilled, (state, { payload }) => {
      state.userList.unshift(userDto.get(payload));
      state.isUserModalOpen = false;
      state.processing = false;
      state.selectedUser = {};
    });
    /* Update User */
    builder.addCase(updateUserAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(updateUserAction.rejected, (state, action) => {
      console.log('action', action);
      state.processing = false;
    });
    builder.addCase(updateUserAction.fulfilled, (state, { payload }) => {
      const updatedUser = userDto.get(payload);
      const index = state.userList.findIndex(
        (user) => user.id_user == updatedUser.id_user
      );
      state.userList[index] = { ...state.userList[index], ...updatedUser };
      state.isUserModalOpen = false;
      state.processing = false;
      state.selectedUser = undefined;
    });
    /* Delete */
    builder.addCase(deleteUserAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(deleteUserAction.rejected, (state, action) => {
      console.error(action);
      state.error = action;
      state.processing = false;
    });
    builder.addCase(deleteUserAction.fulfilled, (state, { payload }) => {
      console.log('payload', payload);
      const id_user = payload.ids[0];
      state.userList = state.userList.filter(
        (user) => user.id_user !== id_user
      );
      state.processing = false;
      state.isDeleteModalOpen = false;
      state.selectedUser = null;
    });
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
