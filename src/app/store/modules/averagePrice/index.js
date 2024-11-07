import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllDocuments } from '@utils/firebaseMethods';
import { firebaseCollections } from '@utils/constants';
import { averagePriceListDto } from '@dto/averagePrice';

export const getUnaveragesPurchaseDetailsAction = createAsyncThunk(
  'averagePrice/getUnaveragesPurchaseDetails',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllDocuments({
        collectionName: firebaseCollections.PURCHASE_DETAIL,
        filterBy: [
          { field: 'isAveraged', condition: '==', value: false },
          { field: 'isPriceless', condition: '==', value: false },
        ],
        excludeReferences: [
          'id_purchase',
          'id_cat_payment_method',
          'id_budget',
        ],
      });
      return result.data;
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
          console.log(action.payload);
          state.unaveragesPurchaseDetails = averagePriceListDto(action.payload);
        }
      )
      .addCase(getUnaveragesPurchaseDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default averagePriceSlice.reducer;
