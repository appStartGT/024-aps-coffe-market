import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employeeDto } from '@dto';
import { cleanModel, firebaseCollections, firebaseFilterBuilder } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getDataFrom,
  uploadFile,
  deleteRecordById,
  insertInto,
  updateRecordBy,
} from '@utils/firebaseMethods';

export const employeeListAction = createAsyncThunk(
  'employee/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(cleanModel(params));
    return await getDataFrom({
      collectionName: firebaseCollections.EMPLOYEE,
      filterBy,
      nonReferenceField: 'id_employee',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const employeeCreateAction = createAsyncThunk(
  'employee/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);
    let photoData = {};
    if (body.photo) {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'employee',
      });
      let photoMetadata = {
        name: body.photo.name,
        size: body.photo.size,
        type: body.photo.type,
      };
      photoData = { photo: photoUrl, photoMetadata };
    }
    const orgData = {
      key: 'id_employee',
      ...body,
      ...photoData,
    };

    return await insertInto({
      collectionName: firebaseCollections.EMPLOYEE,
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

export const employeeGetOneAction = createAsyncThunk(
  'employee/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getDataFrom({
      collectionName: firebaseCollections.EMPLOYEE,
      docId: id,
      nonReferenceField: 'id_employee',
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

export const getOneAllDetalleEmployeeAction = createAsyncThunk(
  'employee/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({
      collectionName: firebaseCollections.EMPLOYEE,
      nonReferenceField: 'id_employee',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const employeeUpdateAction = createAsyncThunk(
  'employee/update',
  async (data, { rejectWithValue }) => {
    let body = employeeDto.organizationPut(data);

    let photoData = {};
    if (typeof body.photo == 'object') {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'employee',
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
      collectionName: firebaseCollections.EMPLOYEE,
      filterBy: [
        {
          field: 'id_employee',
          condition: '==',
          value: orgData.id_employee,
        },
      ],
      data: orgData,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const employeeDeleteAction = createAsyncThunk(
  'employee/delete',
  async ({ id_employee }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.EMPLOYEE,
      filterBy: [{ field: 'id_employee', condition: '==', value: id_employee }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  employeeSelected: null,
  processing: false,
  employeeList: [],
  totalItems: 5,
  employeePaymentSelected: [],
  totalPayments: 5,
};

export const organizationSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployeeSelected: (state) => {
      state.employeeSelected = null;
    },
    clearEmployeePaymentSelected: (state) => {
      state.employeePaymentSelected = [];
    },
    setNewGeneralTotal: (state, payload) => {
      state.employeeSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(employeeListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(employeeListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(employeeListAction.fulfilled, (state, { payload }) => {
      state.employeeList = employeeDto.employeeList(payload.data);
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(employeeCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(employeeCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(employeeCreateAction.fulfilled, (state, { payload }) => {
      const organization = employeeDto.organizationGetOne(payload);
      state.employeeSelected = organization;
      state.processing = false;
    });
    /* GET ONE */
    builder.addCase(employeeGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(employeeGetOneAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(employeeGetOneAction.fulfilled, (state, { payload }) => {
      const datoSeleccioando = employeeDto.organizationGetOne(payload);
      state.employeeSelected = datoSeleccioando;
      state.employeePaymentSelected = datoSeleccioando.payments;

      state.processing = false;
    });

    /* SERVICIO UPDATE */
    builder.addCase(employeeUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(employeeUpdateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(employeeUpdateAction.fulfilled, (state, { payload }) => {
      const updatedOrganization = employeeDto.organizationGetOne(payload);
      state.employeeSelected = updatedOrganization;
      state.employeeList = employeeDto.updateListOrganization(
        state.employeeList,
        payload
      );
      state.employeePaymentSelected = updatedOrganization.payments;
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(employeeDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(employeeDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(employeeDeleteAction.fulfilled, (state, { payload }) => {
      const id_employee = payload.ids[0];
      state.employeeList = state.employeeList.filter(
        (org) => org.id !== id_employee
      );
      state.processing = false;
    });
  },
});

export const { clearEmployeeSelected, clearEmployeePaymentSelected } =
  organizationSlice.actions;

export default organizationSlice.reducer;
