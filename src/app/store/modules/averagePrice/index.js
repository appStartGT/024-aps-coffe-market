import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllDocuments } from '@utils/firebaseMethods';
import { firebaseCollections } from '@utils/constants';
import { averagePriceListDto } from '@dto/averagePrice';

export const getUnaveragesPurchaseDetailsAction = createAsyncThunk(
  'averagePrice/getUnaveragesPurchaseDetails',
  async (_, { rejectWithValue }) => {
    try {
      const [result, getAveragePrices] = await Promise.all([
        getAllDocuments({
          collectionName: firebaseCollections.PURCHASE_DETAIL,
          filterBy: [
            // { field: 'isAveraged', condition: '==', value: false },
            { field: 'isPriceless', condition: '==', value: false },
            { field: 'isSold', condition: '==', value: false },
          ],
          excludeReferences: [
            'id_purchase',
            'id_cat_payment_method',
            'id_budget',
          ],
        }),
        getAllDocuments({
          collectionName: firebaseCollections.AVERAGE_PRICE,
          filterBy: [{ field: 'isSold', condition: '==', value: false }],
        }),
      ]);
      return { result, getAveragePrices };
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to fetch unaveraged purchase details'
      );
    }
  }
);

const initialState = {
  unaveragesPurchaseDetails: [],
  loading: false,
  error: null,
};

export const averagePriceSlice = createSlice({
  name: 'averagePrice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUnaveragesPurchaseDetailsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUnaveragesPurchaseDetailsAction.fulfilled,
        (state, action) => {
          state.loading = false;
          state.unaveragesPurchaseDetails = averagePriceListDto([
            ...action.payload.result.data,
            ...action.payload.getAveragePrices.data,
          ]);
        }
      )
      .addCase(getUnaveragesPurchaseDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default averagePriceSlice.reducer;
