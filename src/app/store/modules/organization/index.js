import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { organizationDto } from '@dto';
import { cleanModel } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getDataFrom,
  uploadFile,
  updateRecordBy,
  deleteRecordById,
  insertInto,
} from '@utils/firebaseMethods';

export const organizationListAction = createAsyncThunk(
  'organization/list',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: 'organization',
      nonReferenceField: 'id_organization',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const organizationCreateAction = createAsyncThunk(
  'organization/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);
    let photoData = {};
    if (body.photo) {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'organization',
      });
      let photoMetadata = {
        name: body.photo.name,
        size: body.photo.size,
        type: body.photo.type,
      };
      photoData = { photo: photoUrl, photoMetadata };
    }
    const orgData = {
      key: 'id_organization',
      ...body,
      ...photoData,
    };

    return await insertInto({
      collectionName: 'organization',
      data: orgData,
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

export const organizationGetOneAction = createAsyncThunk(
  'organization/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getDataFrom({ collectionName: 'organization', docId: id })
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

export const getOneAllDetalleHospitalarioAction = createAsyncThunk(
  'organization/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({ collectionName: 'organization' })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const organizationUpdateAction = createAsyncThunk(
  'organization/update',
  async (data, { rejectWithValue }) => {
    let body = organizationDto.organizationPut(data);

    let photoData = {};
    if (typeof body.photo == 'object') {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'organization',
      });
      let photoMetadata = {
        name: body.photo.name,
        size: body.photo.size,
        type: body.photo.type,
      };

      photoData = { photo: photoUrl, photoMetadata };
    }

    const orgData = {
      ...body,
      ...photoData,
    };

    return await updateRecordBy({
      collectionName: 'organization',
      filterBy: [
        {
          field: 'id_organization',
          condition: '==',
          value: orgData.id_organization,
        },
      ],
      data: orgData,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const organizationDeleteAction = createAsyncThunk(
  'organization/delete',
  async ({ id_organization }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: 'organization',
      filterBy: [
        { field: 'id_organization', condition: '==', value: id_organization },
      ],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  organizationSelected: null,
  processing: false,
  organizationList: [],
  totalItems: 5,
};

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    clearOrganizationSelected: (state) => {
      state.organizationSelected = null;
    },
    setNewGeneralTotal: (state, payload) => {
      state.organizationSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(organizationListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(organizationListAction.rejected, (state, { payload }) => {
      state.error = payload.data;
      state.processing = false;
    });
    builder.addCase(organizationListAction.fulfilled, (state, { payload }) => {
      state.organizationList = organizationDto.organizationList(payload.data);
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(organizationCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(organizationCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(
      organizationCreateAction.fulfilled,
      (state, { payload }) => {
        const organization = organizationDto.organizationGetOne(payload);
        state.organizationSelected = organization;
        state.processing = false;
      }
    );
    /* GET ONE */
    builder.addCase(organizationGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(organizationGetOneAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(
      organizationGetOneAction.fulfilled,
      (state, { payload }) => {
        state.organizationSelected =
          organizationDto.organizationGetOne(payload);
        state.processing = false;
      }
    );

    /* SERVICIO UPDATE */
    builder.addCase(organizationUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(organizationUpdateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(
      organizationUpdateAction.fulfilled,
      (state, { payload }) => {
        const updatedOrganization = organizationDto.organizationGetOne(payload);
        state.organizationSelected = updatedOrganization;
        state.organizationList = organizationDto.updateListOrganization(
          state.organizationList,
          payload
        );
        state.processing = false;
      }
    );

    /*  DELETE */
    builder.addCase(organizationDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(organizationDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      organizationDeleteAction.fulfilled,
      (state, { payload }) => {
        const id_organization = payload.ids[0];
        state.organizationList = state.organizationList.filter(
          (org) => org.id !== id_organization
        );
        state.processing = false;
      }
    );
  },
});

export const { clearOrganizationSelected } = organizationSlice.actions;

export default organizationSlice.reducer;
