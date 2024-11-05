import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllDocuments,
  insertDocument,
  updateRecordBy,
  deleteRecordById,
} from '@utils/firebaseMethods';
import { firebaseCollections, firebaseCollectionsKey } from '@utils/constants';
import {
  expenseList,
  expenseGetOne,
  updateListExpense,
  expensePut,
} from '@dto/expense';

export const createExpenseAction = createAsyncThunk(
  'expense/createExpense',
  async (item, { rejectWithValue }) => {
    const data = {
      ...item,
      createdAt: new Date(),
      isActive: true,
    };
    try {
      const expenseData = await insertDocument({
        collectionName: firebaseCollections.EXPENSE,
        data,
      });
      return expenseData;
    } catch (error) {
      console.error('Create Expense Error:', error);
      return rejectWithValue(error.message || 'Failed to create expense');
    }
  }
);

export const getExpenseListAction = createAsyncThunk(
  'expense/getExpenseList',
  async ({ id_budget }, { rejectWithValue }) => {
    try {
      const currentExpense = await getAllDocuments({
        collectionName: firebaseCollections.EXPENSE,
        filterBy: [
          {
            field: firebaseCollectionsKey.budget,
            condition: '==',
            value: id_budget,
            reference: true,
          },
        ],
      });
      return currentExpense.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addExpenseAction = createAsyncThunk(
  'expense/addExpense',
  async (item, { rejectWithValue }) => {
    try {
      const newItem = await insertDocument({
        collectionName: firebaseCollections.EXPENSE,
        data: item,
      });
      return newItem;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExpenseAction = createAsyncThunk(
  'expense/updateExpense',
  async ({ id_expense, ...data }, { rejectWithValue }) => {
    const dataToUpdate = expensePut(data);
    try {
      const updatedExpense = await updateRecordBy({
        collectionName: firebaseCollections.EXPENSE,
        docId: id_expense,
        data: dataToUpdate,
      });
      return updatedExpense;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteExpenseAction = createAsyncThunk(
  'expense/deleteExpense',
  async ({ id_expense }, { rejectWithValue }) => {
    try {
      await deleteRecordById({
        collectionName: firebaseCollections.EXPENSE,
        docId: id_expense,
      });
      return id_expense;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  expense: null,
  expenseList: [],
  totalItems: 0,
  processing: false,
  error: null,
};

export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearExpenseAction: (state) => {
      state.expense = null;
    },
    setExpenseAction: (state, action) => {
      state.expense = expenseGetOne(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createExpenseAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(createExpenseAction.fulfilled, (state, action) => {
        state.processing = false;
        state.expense = expenseGetOne(action.payload);
        state.expenseList.push(expenseGetOne(action.payload));
      })
      .addCase(createExpenseAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(getExpenseListAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(getExpenseListAction.fulfilled, (state, action) => {
        state.processing = false;
        state.expenseList = expenseList(action.payload);
        state.totalItems = action.payload.length;
      })
      .addCase(getExpenseListAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(addExpenseAction.fulfilled, (state, action) => {
        state.expense = expenseGetOne(action.payload);
        state.expenseList.push(expenseGetOne(action.payload));
      })
      .addCase(updateExpenseAction.fulfilled, (state, action) => {
        state.expense = expenseGetOne(action.payload);
        state.expenseList = updateListExpense(
          state.expenseList,
          action.payload
        );
      })
      .addCase(deleteExpenseAction.fulfilled, (state, action) => {
        state.expense = null;
        state.expenseList = state.expenseList.filter(
          (expense) => expense.id_expense !== action.payload
        );
        state.totalItems -= 1;
      });
  },
});

export const { clearExpenseAction, setExpenseAction } = expenseSlice.actions;

export default expenseSlice.reducer;
