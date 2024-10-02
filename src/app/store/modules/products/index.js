import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tabProductsDto } from '@dto';
import {
  deleteRecordById,
  getDataFrom,
  insertInto,
  updateRecordBy,
  uploadFile,
} from '@utils/firebaseMethods';
import { cleanModel, firebaseCollections, firebaseFilterBuilder } from '@utils';

export const productsListAction = createAsyncThunk(
  'producto-productos/list',
  async (params, { rejectWithValue }) => {
    const filterBy = firebaseFilterBuilder(params);
    return await getDataFrom({
      collectionName: firebaseCollections.PRODUCT,
      filterBy,
      nonReferenceField: 'id_product',
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const productsCreateAction = createAsyncThunk(
  'producto-productos/create',
  async (data, { rejectWithValue }) => {
    const body = tabProductsDto.post(data);

    let photoData = {};
    if (body.photo) {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'profile_photos',
      });
      let photoMetadata = {
        name: body.photo.name,
        size: body.photo.size,
        type: body.photo.type,
      };
      photoData = { photo: photoUrl, photoMetadata };
    }

    const finalData = {
      ...body,
      ...photoData,
    };

    return await insertInto({
      collectionName: firebaseCollections.PRODUCT,
      data: cleanModel(finalData),
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const productsDeleteAction = createAsyncThunk(
  'producto-productos/delete',
  async ({ id_product }, { rejectWithValue /* dispatch */ }) => {
    return await deleteRecordById({
      collectionName: firebaseCollections.PRODUCT,
      filterBy: [{ field: 'id_product', condition: '==', value: id_product }],
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const productstUpdateAction = createAsyncThunk(
  'producto-productos/update',
  async (data, { rejectWithValue }) => {
    const body = tabProductsDto.put(data);

    let photoData = {};
    if (body.photo.name) {
      let photoUrl = await uploadFile({
        file: body.photo,
        path: 'profile_photos',
      });
      let photoMetadata = {
        name: body.photo.name,
        size: body.photo.size,
        type: body.photo.type,
      };
      photoData = { photo: photoUrl, photoMetadata };
    }

    const finalData = {
      ...body,
      ...photoData,
    };

    return await updateRecordBy({
      collectionName: firebaseCollections.PRODUCT,
      filterBy: [
        { field: 'id_product', condition: '==', value: body.id_product },
      ],
      data: cleanModel(finalData),
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  tabProductosList: [],
  totalItemsInventario: 5,
  processing: false,
};

export const productosSlice = createSlice({
  name: 'producto-productos',
  initialState,
  reducers: {
    // clearHospitalarioSelected: (state) => {
    //   state.hospitalarioSelected = null;
    // },
    // clearSearchList: (state /* action */) => {
    //   state.searchList = [];
    // },
  },
  extraReducers: (builder) => {
    /* PRODUCTO PRODUCTOS LIST */
    builder.addCase(productsListAction.pending, (state) => {
      state.processing = true;
    });
    /*  */
    builder.addCase(productsListAction.fulfilled, (state, { payload }) => {
      state.tabProductosList = tabProductsDto.get(payload.data);

      state.totalItemsInventario = payload.data.length;
      state.processing = false;
    });

    /* CREATE */
    builder.addCase(productsCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(productsCreateAction.rejected, (state) => {
      console.error('error', state);
      state.processing = false;
    });
    builder.addCase(productsCreateAction.fulfilled, (state, { payload }) => {
      const newRole = tabProductsDto.get(payload);
      state.tabProductosList = [newRole, ...state.tabProductosList];
      state.processing = false;
    });

    /* UPDATE */
    builder.addCase(productstUpdateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(productstUpdateAction.fulfilled, (state, { payload }) => {
      const updatedProduct = tabProductsDto.get(payload);
      const index = state.tabProductosList.findIndex(
        (pro) => pro.id_product === updatedProduct.id_product
      );
      state.tabProductosList[index] = updatedProduct;
      state.processing = false;
    });

    /* DELETE */
    builder.addCase(productsDeleteAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(productsDeleteAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(productsDeleteAction.fulfilled, (state, { payload }) => {
      const id_product = payload.ids[0];
      state.tabProductosList = state.tabProductosList.filter(
        (produ) => produ.id_product !== id_product
      );
      state.processing = false;
    });
  },
});

// export const { /* clearHospitalarioSelected */ /* , clearSearchList */ } =
//   productosSlice.actions;

export default productosSlice.reducer;
