import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { branchDto } from '@dto';
import { cleanModel, firebaseFilterBuilder } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  deleteRecordById,
  getDataFrom,
  insertInto,
  updateRecordBy,
  uploadFile,
} from '@utils/firebaseMethods';

export const branchListAction = createAsyncThunk(
  'branch/list',
  async (_params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(_params);
    return await getDataFrom({
      collectionName: 'branch',
      filterBy,
      nonReferenceField: 'id_branch',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const branchCreateAction = createAsyncThunk(
  'branch/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);
    let photoData = {};
    if (body.photo) {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'branch',
      });
      let photoMetadata = {
        name: body.photo.name,
        size: body.photo.size,
        type: body.photo.type,
      };
      photoData = { photo: photoUrl, photoMetadata };
    }
    const branchData = {
      key: 'id_branch',
      ...body,
      ...photoData,
    };

    return await insertInto({
      collectionName: 'branch',
      data: branchData,
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      })
      .catch((res) => {
        dispatch(setLoadingMainViewAction(false));
        return rejectWithValue(res);
      });
  }
);

export const branchGetOneAction = createAsyncThunk(
  'branch/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getDataFrom({
      collectionName: 'branch',
      docId: id,
      nonReferenceField: 'id_branch',
    })
      .then((res) => {
        dispatch(setLoadingMainViewAction(false));
        return res;
      })
      .catch((res) => {
        dispatch(setLoadingMainViewAction(false));
        return rejectWithValue(res);
      });
  }
);

export const branchUpdateAction = createAsyncThunk(
  'branch/update',
  async (data, { rejectWithValue }) => {
    let body = branchDto.branchPut(data);

    let photoData = {};
    if (typeof body.photo == 'object') {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'branch',
      });
      let photoMetadata = {
        name: body.photo.name,
        size: body.photo.size,
        type: body.photo.type,
      };

      photoData = { photo: photoUrl, photoMetadata };
    }

    const branchData = {
      ...body,
      ...photoData,
    };

    return await updateRecordBy({
      collectionName: 'branch',
      filterBy: [
        {
          field: 'id_branch',
          condition: '==',
          value: orgData.id_branch,
        },
      ],
      data: branchData,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const branchDeleteAction = createAsyncThunk(
  'branch/delete',
  async ({ id_branch }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: 'branch',
      filterBy: [{ field: 'id_branch', condition: '==', value: id_branch }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  branchSelected: null,
  processing: false,
  branchList: [],
  totalItems: 5,
  branchListForSelect: [],
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
    builder.addCase(branchListAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(branchListAction.fulfilled, (state, { payload }) => {
      state.branchList = branchDto.branchList(payload.data);
      state.branchListForSelect = branchDto.branchListForSelect(payload.data);
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(branchCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(branchCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(branchCreateAction.fulfilled, (state, { payload }) => {
      const branchData = branchDto.branchGetOne(payload);
      state.branchSelected = branchData;
      state.processing = false;
    });
    /* GET ONE */
    builder.addCase(branchGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(branchGetOneAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(branchGetOneAction.fulfilled, (state, { payload }) => {
      state.branchSelected = branchDto.branchGetOne(payload);
      state.processing = false;
    });

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
    builder.addCase(branchUpdateAction.fulfilled, (state, { payload }) => {
      const updateBranch = branchDto.branchGetOne(payload);
      state.branchSelected = updateBranch;
      state.branchList = branchDto.updateListBranch(state.branchList, payload);
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(branchDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(branchDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(branchDeleteAction.fulfilled, (state, { payload }) => {
      const id_branch = payload.ids[0];
      state.branchList = state.branchList.filter(
        (branch) => branch.id_branch !== id_branch
      );
      state.processing = false;
    });
  },
});

export const { clearBranchSelected } = branchSlice.actions;

export default branchSlice.reducer;
