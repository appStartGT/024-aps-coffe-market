import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { truckloadDto } from '@dto';
import {
  cleanModel,
  firebaseCollections,
  firebaseCollectionsKey,
} from '@utils';
import {
  getAllDocuments,
  deleteRecordById,
  insertDocument,
  updateRecordBy,
  uploadFile,
} from '@utils/firebaseMethods';
import { updateSaleListTruckloadsAction } from '../sale';

export const truckloadListAction = createAsyncThunk(
  'truckload/list',
  async ({ id_sale }, { rejectWithValue, getState, dispatch }) => {
    const state = getState();
    const saleListTruckloads = state.sale.rowTruckloads;

    if (saleListTruckloads && saleListTruckloads.length > 0) {
      const filteredTruckloads = saleListTruckloads.filter(
        (truckload) => truckload.id_sale === id_sale
      );
      if (filteredTruckloads.length > 0) {
        return {
          data: filteredTruckloads,
          totalItems: filteredTruckloads.length,
        };
      }
    }

    return await getAllDocuments({
      collectionName: firebaseCollections.BENEFICIO_TRUCKLOAD,
      filterBy: [
        {
          field: 'id_sale',
          condition: '==',
          value: id_sale,
          reference: true,
        },
      ],
    })
      .then((res) => {
        dispatch(updateSaleListTruckloadsAction(res.data));
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

export const truckloadCreateAction = createAsyncThunk(
  'truckload/create',
  async (data, { rejectWithValue, dispatch }) => {
    let body = cleanModel(data);

    if (data.colilla && data.colilla instanceof File) {
      let url = await uploadFile({
        file: data.colilla,
        path: 'truckloads',
      });
      let metadata = {
        name: data.colilla.name,
        size: data.colilla.size,
        type: data.colilla.type,
      };
      body.colilla = { url, metadata };
    }

    const truckloadData = {
      ...body,
      isAccumulated: false,
      id_cat_truckload_license_plate: data.id_cat_truckload_license_plate.value,
    };

    return await insertDocument({
      collectionName: firebaseCollections.BENEFICIO_TRUCKLOAD,
      data: truckloadData,
    })
      .then((res) => {
        dispatch(updateSaleListTruckloadsAction([res]));
        return { ...res };
      })
      .catch((res) => {
        return rejectWithValue(res);
      });
  }
);

export const truckloadUpdateAction = createAsyncThunk(
  'truckload/update',
  async (data, { rejectWithValue, dispatch }) => {
    let body = truckloadDto.truckloadPut(data);
    if (data.colilla && data.colilla instanceof File) {
      let url = await uploadFile({
        file: data.colilla,
        path: 'truckloads',
      });
      let metadata = {
        name: data.colilla.name,
        size: data.colilla.size,
        type: data.colilla.type,
      };
      body.colilla = { url, metadata };
    }
    return await updateRecordBy({
      collectionName: firebaseCollections.BENEFICIO_TRUCKLOAD,
      data: body,
      filterBy: [
        {
          field: firebaseCollectionsKey.beneficio_truckload,
          condition: '==',
          value: data[firebaseCollectionsKey.beneficio_truckload],
        },
      ],
    })
      .then((res) => {
        dispatch(updateSaleListTruckloadsAction([res]));
        return res;
      })
      .catch((res) => rejectWithValue(res));
  }
);

export const truckloadDeleteAction = createAsyncThunk(
  'truckload/delete',
  async ({ id_beneficio_truckload }, { rejectWithValue }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.BENEFICIO_TRUCKLOAD,
      filterBy: [
        {
          field: firebaseCollectionsKey.beneficio_truckload,
          condition: '==',
          value: id_beneficio_truckload,
        },
      ],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);
export const truckloadUpdateReceivedAction = createAsyncThunk(
  'truckload/truckloadUpdateReceivedAction',
  async (_params, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const currentDetails = state.sale.rowTruckloads;
      const updatedDetails = currentDetails.map((detail) => ({
        id_beneficio_truckload: detail.id_beneficio_truckload,
        isReceived: true,
      }));
      if (!updatedDetails.length) {
        return rejectWithValue('No se encontraron detalles');
      }

      return await updateRecordBy({
        collectionName: firebaseCollections.BENEFICIO_TRUCKLOAD,
        data: { isReceived: true },
        showAlert: false,
      }).then((res) => {
        dispatch(updateSaleListTruckloadsAction(updatedDetails));
        return res;
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTruckloadList = createAsyncThunk(
  'truckload/updateList',
  async (data, { getState }) => {
    const state = getState();
    const id_sale = state.sale.saleSelected.id_sale;
    return data.filter((truckload) => truckload.id_sale === id_sale);
  }
);

const initialState = {
  truckloadSelected: null,
  processing: false,
  truckloadList: [],
  totalItems: 0,
};

export const truckloadSlice = createSlice({
  name: 'truckload',
  initialState,
  reducers: {
    clearTruckloadSelected: (state) => {
      state.truckloadSelected = null;
    },
    setTruckloadDetail: (state, action) => {
      state.truckloadSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(truckloadListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(truckloadListAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(truckloadListAction.fulfilled, (state, { payload }) => {
      state.truckloadList = truckloadDto.truckloadList(payload.data);
      state.totalItems = payload.totalItems;
      state.processing = false;
    });

    builder.addCase(truckloadCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(truckloadCreateAction.rejected, (state, { payload }) => {
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(truckloadCreateAction.fulfilled, (state) => {
      state.processing = false;
    });

    builder.addCase(truckloadUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(truckloadUpdateAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(truckloadUpdateAction.fulfilled, (state) => {
      state.processing = false;
    });

    builder.addCase(truckloadDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(truckloadDeleteAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(truckloadDeleteAction.fulfilled, (state, { payload }) => {
      const id_truckload = payload.ids[0];
      state.truckloadList = state.truckloadList.filter(
        (truckload) =>
          truckload[firebaseCollectionsKey.beneficio_truckload] !== id_truckload
      );
      state.processing = false;
    });

    builder.addCase(truckloadUpdateReceivedAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(truckloadUpdateReceivedAction.rejected, (state, action) => {
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(
      truckloadUpdateReceivedAction.fulfilled,
      (state, { payload }) => {
        state.truckloadList = state.truckloadList.map((truckload) => ({
          ...truckload,
          isReceived: true,
        }));
        state.processing = false;
      }
    );

    builder.addCase(updateTruckloadList.fulfilled, (state, { payload }) => {
      state.truckloadList = truckloadDto.truckloadList(payload);
    });
  },
});

export const {
  clearTruckloadSelected,
  setTruckloadDetail,
  // updateTruckloadList,
} = truckloadSlice.actions;

export default truckloadSlice.reducer;
