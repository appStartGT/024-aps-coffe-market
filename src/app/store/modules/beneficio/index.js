import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { beneficioDto } from '@dto';
import { cleanModel, firebaseCollections, firebaseFilterBuilder } from '@utils';
import { setLoadingMainViewAction } from '../main';
import {
  getAllDocuments,
  deleteRecordById,
  insertDocument,
  updateRecordBy,
} from '@utils/firebaseMethods';

export const beneficioListAction = createAsyncThunk(
  'beneficio/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(cleanModel(params));
    return await getAllDocuments({
      collectionName: firebaseCollections.BENEFICIO,
      filterBy,
      nonReferenceField: 'id_beneficio',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const beneficioCreateAction = createAsyncThunk(
  'beneficio/create',
  async (data, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    let body = cleanModel(data);
    const beneficioData = {
      key: 'id_beneficio',
      ...body,
    };

    return await insertDocument({
      collectionName: firebaseCollections.BENEFICIO,
      data: beneficioData,
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

export const beneficioGetOneAction = createAsyncThunk(
  'beneficio/getOne',
  async ({ id }, { rejectWithValue, dispatch }) => {
    dispatch(setLoadingMainViewAction(true));
    return await getAllDocuments({
      collectionName: firebaseCollections.BENEFICIO,
      docId: id,
      nonReferenceField: 'id_beneficio',
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

export const getOneAllDetalleBeneficioAction = createAsyncThunk(
  'beneficio/getOneAllDetalle',
  async (_params, { rejectWithValue }) => {
    return await getAllDocuments({
      collectionName: firebaseCollections.BENEFICIO,
      nonReferenceField: 'id_beneficio',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const beneficioUpdateAction = createAsyncThunk(
  'beneficio/update',
  async (data, { rejectWithValue }) => {
    let body = beneficioDto.beneficioPut(data);

    const beneficioData = {
      ...body,
    };

    return await updateRecordBy({
      collectionName: firebaseCollections.BENEFICIO,
      filterBy: [
        {
          field: 'id_beneficio',
          condition: '==',
          value: beneficioData.id_beneficio,
        },
      ],
      data: beneficioData,
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const beneficioDeleteAction = createAsyncThunk(
  'beneficio/delete',
  async ({ id_beneficio }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.BENEFICIO,
      filterBy: [{ field: 'id_beneficio', condition: '==', value: id_beneficio }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  beneficioSelected: null,
  processing: false,
  beneficioList: [],
  totalItems: 5,
  beneficioPaymentSelected: [],
  totalPayments: 5,
};

export const beneficioSlice = createSlice({
  name: 'beneficio',
  initialState,
  reducers: {
    clearBeneficioSelected: (state) => {
      state.beneficioSelected = null;
    },
    clearBeneficioPaymentSelected: (state) => {
      state.beneficioPaymentSelected = [];
    },
    setNewGeneralTotal: (state, payload) => {
      state.beneficioSelected.total = payload.payload;
    },
  },
  extraReducers: (builder) => {
    /* SERVICIO LIST */
    builder.addCase(beneficioListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(beneficioListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(beneficioListAction.fulfilled, (state, { payload }) => {
      state.beneficioList = beneficioDto.beneficioList(payload.data);
      state.totalItems = payload.data.totalItems;
      state.processing = false;
    });

    /*  CREATE */
    builder.addCase(beneficioCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(beneficioCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(beneficioCreateAction.fulfilled, (state, { payload }) => {
      const beneficio = beneficioDto.beneficioGetOne(payload);
      state.beneficioSelected = beneficio;
      state.processing = false;
    });
    /* GET ONE */
    builder.addCase(beneficioGetOneAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(beneficioGetOneAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(beneficioGetOneAction.fulfilled, (state, { payload }) => {
      const beneficioSelected = beneficioDto.beneficioGetOne(payload);
      state.beneficioSelected = beneficioSelected;
      state.beneficioPaymentSelected = beneficioSelected.payments;

      state.processing = false;
    });

    /* SERVICIO UPDATE */
    builder.addCase(beneficioUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(beneficioUpdateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(beneficioUpdateAction.fulfilled, (state, { payload }) => {
      const updatedBeneficio = beneficioDto.beneficioGetOne(payload);
      state.beneficioSelected = updatedBeneficio;
      state.beneficioList = beneficioDto.updateListBeneficio(
        state.beneficioList,
        payload
      );
      state.beneficioPaymentSelected = updatedBeneficio.payments;
      state.processing = false;
    });

    /*  DELETE */
    builder.addCase(beneficioDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(beneficioDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(beneficioDeleteAction.fulfilled, (state, { payload }) => {
      const id_beneficio = payload.ids[0];
      state.beneficioList = state.beneficioList.filter(
        (beneficio) => beneficio.id !== id_beneficio
      );
      state.processing = false;
    });
  },
});

export const { clearBeneficioSelected, clearBeneficioPaymentSelected } =
  beneficioSlice.actions;

export default beneficioSlice.reducer;
