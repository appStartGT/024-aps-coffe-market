import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseFilterBuilder } from '@utils';
import { getAllDocuments, updateRecordBy } from '@utils/firebaseMethods';
import { setRoleAction } from '../role';

export const permissionListAction = createAsyncThunk(
  'permission/list',
  async ({ id_role, id_subject }, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder({ id_role, id_subject });
    return await getAllDocuments({ collectionName: 'permission', filterBy })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const permissionCreateOrUpdateAction = createAsyncThunk(
  'permission/createOrUpdate',
  async (action, { rejectWithValue, getState, dispatch }) => {
    const selectedRole = getState().role.selectedRole;
    let currentPermissions = [
      ...(getState().role.selectedRole?.permissions || []),
    ];
    const selectedSubject = getState().subject.selectedSubject;

    const permissionIndex = currentPermissions.findIndex(
      (permission) => permission.id_subject == selectedSubject.id_subject
    );
    if (permissionIndex > -1) {
      const selectedPermission = currentPermissions[permissionIndex];
      const newActions = selectedPermission?.actions.includes(action)
        ? selectedPermission.actions.filter((item) => item != action)
        : [...(selectedPermission?.actions ?? []), action];
      //update permission
      currentPermissions[permissionIndex] = {
        ...selectedPermission,
        actions: newActions,
      };
    } else {
      currentPermissions.unshift({
        id_subject: selectedSubject.id_subject,
        subject: selectedSubject.name,
        actions: [action],
      });
    }
    //Romeve unnecessary data
    const subjectWithOutActions = currentPermissions.find(
      (item) => !item.actions.length
    );
    //remove Subject without actions
    if (subjectWithOutActions) {
      currentPermissions = currentPermissions.filter(
        (item) => item.id_subject != subjectWithOutActions.id_subject
      );
    }
    return await updateRecordBy({
      collectionName: 'role',
      filterBy: [
        { field: 'id_role', condition: '==', value: selectedRole.id_role },
      ],
      data: { permissions: currentPermissions },
    })
      .then((res) => {
        dispatch(
          setRoleAction({ ...selectedRole, permissions: currentPermissions })
        );
        return res;
      })
      .catch((res) => {
        return rejectWithValue(res);
      });
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
    builder.addCase(permissionListAction.rejected, (state, { payload }) => {
      console.error({ payload });
      state.processing = false;
    });
    builder.addCase(permissionListAction.fulfilled, (state, { payload }) => {
      state.permissionList = payload.data;
      state.processing = false;
    });
    builder.addCase(permissionCreateOrUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      permissionCreateOrUpdateAction.rejected,
      (state, { payload }) => {
        console.error({ payload });
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      permissionCreateOrUpdateAction.fulfilled,
      (state /*  { payload } */) => {
        // const { id_action, id_permission, isActive } = payload;
        // const index = state.permissionList.findIndex(
        //   (permission) => permission.id_action === id_action
        // );
        // if (index !== -1) {
        //   state.permissionList[index].isActive = isActive;
        //   state.permissionList[index].id_permission = id_permission;
        // }
        // state.selectedPermission.id_permission = id_permission;
        state.processing = false;
      }
    );
  },
});

export const { setPermissionListAction, setPermissionAction } =
  permissionSlice.actions;

export default permissionSlice.reducer;
