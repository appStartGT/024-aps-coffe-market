import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllDocuments,
  insertDocument,
  updateRecordBy,
  deleteRecordById,
} from '@utils/firebaseMethods';
import { firebaseCollections, firebaseCollectionsKey } from '@utils/constants';

export const createBudgetAction = createAsyncThunk(
  'budget/createBudget',
  async (item, { rejectWithValue }) => {
    const data = {
      ...item,
      isClosed: false,
    };
    let budgetItem = null;
    if (item.initialBalance) {
      budgetItem = {
        rubro: 'Saldo Inicial',
        amount: item.initialBalance,
      };
    }
    try {
      const budgetResponse = await insertDocument({
        collectionName: firebaseCollections.BUDGET,
        data,
      });
      let budgetItemResponse = null;

      if (budgetItem) {
        budgetItem.id_budget = budgetResponse.id_budget;
        budgetItemResponse = await insertDocument({
          collectionName: firebaseCollections.BUDGET_ITEM,
          data: budgetItem,
          excludeReferences: ['id_budget'], //to avoid circular reference
        });
      }
      return {
        budget: budgetResponse,
        budget_items: budgetItemResponse?.data || [],
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getBudgetAction = createAsyncThunk(
  'budget/getBudget',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const budget = state.budget.budget;
      const budget_items = state.budget.budget_items;

      if (budget && budget_items.length > 0) {
        return { budget, budget_items };
      } else {
        //just the last budget will be used deleted:false by default the method do it
        let currentBudget = await getAllDocuments({
          collectionName: firebaseCollections.BUDGET,
          filterBy: [{ field: 'isClosed', condition: '==', value: false }],
        });
        currentBudget = currentBudget.data[0] || null;

        let id_budget = null;
        if (currentBudget) {
          id_budget = currentBudget.id_budget;
        }
        if (id_budget) {
          const newBudget_items = await getAllDocuments({
            collectionName: firebaseCollections.BUDGET_ITEM,
            filterBy: [
              {
                field: firebaseCollectionsKey.budget,
                condition: '==',
                value: id_budget,
                reference: true,
              },
            ],
            excludeReferences: ['id_budget'],
          });

          return { budget: currentBudget, budget_items: newBudget_items.data };
        } else {
          return { budget: null, budget_items: [] };
        }
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBudgetItemAction = createAsyncThunk(
  'budget/addItem',
  async (item, { rejectWithValue }) => {
    try {
      const newItem = await insertDocument({
        collectionName: firebaseCollections.BUDGET_ITEM,
        data: item,
        excludeReferences: ['id_budget'],
      });
      return newItem;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBudgetItemAction = createAsyncThunk(
  'budget/updateItem',
  async ({ id_budget_item, item }, { rejectWithValue }) => {
    try {
      await updateRecordBy({
        collectionName: firebaseCollections.BUDGET_ITEM,
        docId: id_budget_item,
        data: item,
      });
      return { id_budget_item, ...item };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteBudgetItemAction = createAsyncThunk(
  'budget/deleteItem',
  async (id_budget_item, { rejectWithValue }) => {
    try {
      await deleteRecordById({
        collectionName: firebaseCollections.BUDGET_ITEM,
        docId: id_budget_item,
      });
      return id_budget_item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  budget: null,
  budget_items: [],
  processing: false,
  error: null,
};

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearBudget: (state) => {
      state.budget = null;
      state.budget_items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBudgetAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(createBudgetAction.fulfilled, (state, action) => {
        state.processing = false;
        const { budget, budget_items } = action.payload;
        state.budget = budget;
        state.budget_items = budget_items;
      })
      .addCase(createBudgetAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(getBudgetAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(getBudgetAction.fulfilled, (state, action) => {
        state.processing = false;
        const { budget, budget_items } = action.payload;
        state.budget = budget;
        state.budget_items = budget_items;
      })
      .addCase(getBudgetAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(addBudgetItemAction.fulfilled, (state, action) => {
        state.budget_items.push(action.payload);
      })
      .addCase(updateBudgetItemAction.fulfilled, (state, action) => {
        const index = state.budget_items.findIndex(
          (item) => item.id_budget_item === action.payload.id_budget_item
        );
        if (index !== -1) {
          state.budget_items[index] = action.payload;
        }
      })
      .addCase(deleteBudgetItemAction.fulfilled, (state, action) => {
        state.budget_items = state.budget_items.filter(
          (item) => item.id_budget_item !== action.payload
        );
      });
  },
});

export const { clearBudget } = budgetSlice.actions;

export default budgetSlice.reducer;
