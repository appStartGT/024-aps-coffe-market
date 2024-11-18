import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  firestore,
  getAllDocuments,
  insertDocument,
  updateRecordBy,
  deleteRecordById,
} from '@utils/firebaseMethods';
import { firebaseCollections, firebaseCollectionsKey } from '@utils/constants';

export const createBudgetAction = createAsyncThunk(
  'budget/createBudget',
  async (item, { rejectWithValue, getState }) => {
    const state = getState();
    const old_budget = state.budget.budget?.id_budget;
    const data = {
      ...item,
      isClosed: false,
      createdAt: new Date(),
      deleted: false,
      isActive: true,
    };
    let budgetItem = null;
    if (item.initialBalance) {
      budgetItem = {
        rubro: 'Saldo Inicial',
        amount: item.initialBalance,
        createdAt: new Date(),
        deleted: false,
        isActive: true,
      };
    }
    try {
      const budgetRef = firestore.collection(firebaseCollections.BUDGET);
      const budgetItemRef = firestore.collection(
        firebaseCollections.BUDGET_ITEM
      );
      let budgetDoc = null;

      await firestore.runTransaction(async (transaction) => {
        // Update all budgets to deleted:true
        const budgets = await budgetRef.get();
        budgets.docs.forEach((doc) => {
          transaction.update(doc.ref, { deleted: true, isClosed: true });
        });

        // Create a new budget
        const newBudgetRef = budgetRef.doc();
        transaction.set(newBudgetRef, { ...data, id_budget: newBudgetRef.id });
        budgetDoc = newBudgetRef;

        // Create the budget items if exists
        if (budgetItem) {
          const newItemRef = budgetItemRef.doc();
          budgetItem.id_budget = newBudgetRef;
          transaction.set(newItemRef, {
            ...budgetItem,
            id_budget_item: newItemRef.id,
            isInitial: true,
          });
        }
      });

      // Fetch the newly created budget
      const budgetSnapshot = await budgetDoc.get();
      const budgetData = {
        ...budgetSnapshot.data(),
        id_budget: budgetDoc.id,
      };

      // Fetch budget items if they exist
      let budgetItems = [];
      if (budgetItem) {
        const itemsSnapshot = await budgetItemRef
          .where('id_budget', '==', budgetDoc)
          .get();
        budgetItems = itemsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id_budget_item: doc.id,
        }));
      }

      return {
        budget: budgetData,
        budget_items: budgetItems,
        old_budget,
      };
    } catch (error) {
      console.error('Create Budget Error:', error);
      return rejectWithValue(error.message || 'Failed to create budget');
    }
  }
);

export const getBudgetAction = createAsyncThunk(
  'budget/getBudget',
  async (_, { rejectWithValue, /* getState, */ dispatch }) => {
    try {
      // const state = getState();
      // const budget = state.budget.budget;
      // const budget_items = state.budget.budget_items;
      let id_budget = null;

      // if (budget && budget_items.length > 0) {
      //   id_budget = budget.id_budget;
      //   return { budget, budget_items };
      // } else {
      //just the last budget will be used deleted:false by default the method do it
      let currentBudget = await getAllDocuments({
        collectionName: firebaseCollections.BUDGET,
        filterBy: [{ field: 'isClosed', condition: '==', value: false }],
      });
      currentBudget = currentBudget.data[0] || null;

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

        id_budget = currentBudget.id_budget;
        // Fetch the expenses for the current budget
        dispatch(budgetExpensesAction(id_budget));

        return { budget: currentBudget, budget_items: newBudget_items.data };
      } else {
        return { budget: null, budget_items: [] };
      }
      // }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const budgetExpensesAction = createAsyncThunk(
  'budget/expenses',
  async (id_budget, { rejectWithValue }) => {
    try {
      const [purchaseDetails, expenses, loans] = await Promise.all([
        getAllDocuments({
          collectionName: firebaseCollections.PURCHASE_DETAIL,
          filterBy: [
            {
              field: 'id_budget',
              condition: '==',
              value: id_budget,
              reference: true,
            },
            { field: 'isPriceless', condition: '==', value: false },
          ],
          excludeReferences: [
            'id_budget',
            'id_average_price',
            'id_sale',
            'id_purchase_detail_remate',
            'id_purchase',
          ],
        }),
        getAllDocuments({
          collectionName: firebaseCollections.EXPENSE,
          filterBy: [
            {
              field: 'id_budget',
              condition: '==',
              value: id_budget,
              reference: true,
            },
          ],
          excludeReferences: ['id_budget'],
        }),
        getAllDocuments({
          collectionName: firebaseCollections.LOAN,
          filterBy: [
            {
              field: 'id_budget',
              condition: '==',
              value: id_budget,
              reference: true,
            },
            {
              field: 'isPaid',
              condition: '==',
              value: false,
            },
          ],
          excludeReferences: ['id_budget'],
        }),
      ]);

      const groupedPurchaseDetails = purchaseDetails.data.reduce(
        (acc, item) => {
          if (item.id_cat_payment_method) {
            const key = item.cat_payment_method.name;
            if (!acc[key]) {
              acc[key] = {
                items: [],
                total: 0,
              };
            }
            acc[key].items.push(item);
            acc[key].total += Number(item.price) * Number(item.quantity) || 0;
          }
          return acc;
        },
        {}
      );

      const groupedExpenses = expenses.data.reduce((acc, item) => {
        if (item.id_cat_expense_type) {
          const key = item.cat_expense_type.name;
          if (!acc[key]) {
            acc[key] = {
              items: [],
              total: 0,
            };
          }
          acc[key].items.push(item);
          acc[key].total += Number(item.amount) || 0;
        }
        return acc;
      }, {});

      const groupedLoans = loans.data.reduce((acc, item) => {
        const key = 'Loans';
        if (!acc[key]) {
          acc[key] = {
            items: [],
            total: 0,
          };
        }
        acc[key].items.push(item);
        acc[key].total += Number(item.amount) || 0;
        return acc;
      }, {});

      return {
        purchaseDetails: groupedPurchaseDetails,
        expenses: groupedExpenses,
        loans: groupedLoans,
      };
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
  async ({ id_budget_item, ...data }, { rejectWithValue }) => {
    try {
      await updateRecordBy({
        collectionName: firebaseCollections.BUDGET_ITEM,
        docId: id_budget_item,
        data,
      });
      return { id_budget_item, ...data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteBudgetItemAction = createAsyncThunk(
  'budget/deleteItem',
  async ({ id_budget_item }, { rejectWithValue }) => {
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
  old_budget: null,
  expenses: {
    purchaseDetails: [],
    expenses: [],
    loans: [],
    totals: {
      purchaseTotal: 0,
      expenseTotal: 0,
      loanTotal: 0,
      grandTotal: 0,
    },
  },
};

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearBudget: (state) => {
      state.budget = null;
      state.budget_items = [];
      state.old_budget = null;
      state.expenses = {
        purchaseDetails: [],
        expenses: [],
        loans: [],
        totals: {
          purchaseTotal: 0,
          expenseTotal: 0,
          loanTotal: 0,
          grandTotal: 0,
        },
      };
    },
    setOldBudget: (state, action) => {
      state.old_budget = action.payload;
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
        state.old_budget = action.payload.old_budget;
        state.expenses = {
          purchaseDetails: [],
          expenses: [],
          loans: [],
          totals: {
            purchaseTotal: 0,
            expenseTotal: 0,
            loanTotal: 0,
            grandTotal: 0,
          },
        };
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
      })
      .addCase(budgetExpensesAction.pending, (state) => {
        state.processing = true;
      })
      .addCase(budgetExpensesAction.fulfilled, (state, action) => {
        state.processing = false;
        state.expenses.purchaseDetails = action.payload.purchaseDetails;
        state.expenses.expenses = action.payload.expenses;
        state.expenses.loans = action.payload.loans;

        // Calculate totals
        const purchaseTotal = Object.values(
          action.payload.purchaseDetails
        ).reduce((sum, category) => sum + category.total, 0);
        const expenseTotal = Object.values(action.payload.expenses).reduce(
          (sum, category) => sum + category.total,
          0
        );
        const loanTotal = Object.values(action.payload.loans).reduce(
          (sum, category) => sum + category.total,
          0
        );
        const grandTotal = purchaseTotal + expenseTotal + loanTotal;

        state.expenses.totals = {
          purchaseTotal,
          expenseTotal,
          loanTotal,
          grandTotal,
        };
      })
      .addCase(budgetExpensesAction.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
      });
  },
});

export const { clearBudget, setOldBudget } = budgetSlice.actions;

export default budgetSlice.reducer;
