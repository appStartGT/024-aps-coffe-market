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

export const truckloadListAction = createAsyncThunk(
  'truckload/list',
  async ({ id_sale }, { rejectWithValue }) => {
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
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const truckloadCreateAction = createAsyncThunk(
  'truckload/create',
  async (data, { rejectWithValue }) => {
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
    };

    return await insertDocument({
      collectionName: firebaseCollections.BENEFICIO_TRUCKLOAD,
      data: truckloadData,
    })
      .then((res) => {
        return { ...res };
      })
      .catch((res) => {
        return rejectWithValue(res);
      });
  }
);

export const truckloadUpdateAction = createAsyncThunk(
  'truckload/update',
  async (data, { rejectWithValue }) => {
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
      .then((res) => res)
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
    /* LIST */
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

    /* CREATE */
    builder.addCase(truckloadCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(truckloadCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(truckloadCreateAction.fulfilled, (state, { payload }) => {
      const truckload = truckloadDto.truckloadGetOne(payload);
      state.truckloadSelected = truckload;
      state.truckloadList = [...state.truckloadList, truckload];
      state.processing = false;
    });

    /* UPDATE */
    builder.addCase(truckloadUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(truckloadUpdateAction.rejected, (state, action) => {
      console.error(action);
      state.error = action.payload;
      state.processing = false;
    });
    builder.addCase(truckloadUpdateAction.fulfilled, (state, { payload }) => {
      const updatedTruckload = truckloadDto.truckloadGetOne(payload);
      state.truckloadSelected = updatedTruckload;
      state.truckloadList = state.truckloadList.map((truckload) =>
        truckload[firebaseCollectionsKey.beneficio_truckload] ===
        updatedTruckload[firebaseCollectionsKey.beneficio_truckload]
          ? updatedTruckload
          : truckload
      );
      state.processing = false;
    });

    /* DELETE */
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
  },
});

export const { clearTruckloadSelected, setTruckloadDetail } =
  truckloadSlice.actions;

export default truckloadSlice.reducer;
