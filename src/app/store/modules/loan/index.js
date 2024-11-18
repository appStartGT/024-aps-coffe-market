import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllDocuments,
  insertDocument,
  updateRecordBy,
  deleteRecordById,
} from '@utils/firebaseMethods';
import { firebaseCollections, firebaseCollectionsKey } from '@utils/constants';
import {
  loanList,
  loanGetOne,
  updateListLoan,
  loanPut,
  loanPost,
} from '@dto/loan';

export const createLoanAction = createAsyncThunk(
  'loan/createLoan',
  async (item, { rejectWithValue }) => {
    const data = loanPost(item);
    try {
      const loanData = await insertDocument({
        collectionName: firebaseCollections.LOAN,
        data,
      });
      return loanData;
    } catch (error) {
      console.error('Create Loan Error:', error);
      return rejectWithValue(error.message || 'Failed to create loan');
    }
  }
);

export const getLoanListAction = createAsyncThunk(
  'loan/getLoanList',
  async ({ id_budget }, { rejectWithValue }) => {
    try {
      const currentLoan = await getAllDocuments({
        collectionName: firebaseCollections.LOAN,
        filterBy: [
          {
            field: firebaseCollectionsKey.budget,
            condition: '==',
            value: id_budget,
            reference: true,
          },
        ],
      });
      return currentLoan.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addLoanAction = createAsyncThunk(
  'loan/addLoan',
  async (item, { rejectWithValue }) => {
    try {
      const newItem = await insertDocument({
        collectionName: firebaseCollections.LOAN,
        data: item,
      });
      return newItem;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLoanAction = createAsyncThunk(
  'loan/updateLoan',
  async ({ id_loan, ...data }, { rejectWithValue }) => {
    const dataToUpdate = loanPut(data);
    try {
      const updatedLoan = await updateRecordBy({
        collectionName: firebaseCollections.LOAN,
        docId: id_loan,
        data: dataToUpdate,
      });
      return updatedLoan;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLoanAction = createAsyncThunk(
  'loan/deleteLoan',
  async ({ id_loan }, { rejectWithValue }) => {
    try {
      await deleteRecordById({
        collectionName: firebaseCollections.LOAN,
        docId: id_loan,
      });
      return id_loan;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loan: null,
  loanList: [],
  totalItems: 0,
  processing: false,
  error: null,
};

export const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    clearLoanAction: (state) => {
      state.loan = null;
    },
    setLoanAction: (state, action) => {
      state.loan = loanGetOne(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLoanAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(createLoanAction.fulfilled, (state, action) => {
        state.processing = false;
        state.loan = loanGetOne(action.payload);
        state.loanList.push(loanGetOne(action.payload));
      })
      .addCase(createLoanAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(getLoanListAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(getLoanListAction.fulfilled, (state, action) => {
        state.processing = false;
        state.loanList = loanList(action.payload);
        state.totalItems = action.payload.length;
      })
      .addCase(getLoanListAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(addLoanAction.fulfilled, (state, action) => {
        state.loan = loanGetOne(action.payload);
        state.loanList.push(loanGetOne(action.payload));
      })
      .addCase(updateLoanAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(updateLoanAction.fulfilled, (state, action) => {
        state.processing = false;
        state.loan = loanGetOne(action.payload);
        state.loanList = updateListLoan(state.loanList, action.payload);
      })
      .addCase(updateLoanAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(deleteLoanAction.fulfilled, (state, action) => {
        state.loan = null;
        state.loanList = state.loanList.filter(
          (loan) => loan.id_loan !== action.payload
        );
        state.totalItems -= 1;
      });
  },
});

export const { clearLoanAction, setLoanAction } = loanSlice.actions;

export default loanSlice.reducer;