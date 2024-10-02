import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginApi = createAsyncThunk('login/login', async () => {
  console.log('corre');
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
    return response.data;
  } catch (err) {
    console.log(err);

    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  value: 0,
  logged: false,
};

export const counterSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    login: (state) => {
      state.logged = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginApi.pending, () => {
      console.log('Pending');
    });
    builder.addCase(loginApi.rejected, (action) => {
      console.log('meta', action.meta);

      console.log('rejected');
    });
    builder.addCase(loginApi.fulfilled, (state, action) => {
      state.logged = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, login } =
  counterSlice.actions;

export default counterSlice.reducer;
