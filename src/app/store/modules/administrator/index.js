import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTab: 0,
};

export const administratorSlice = createSlice({
  name: 'administrator',
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
  extraReducers: (/* builder */) => {},
});

export const { setSelectedTab } = administratorSlice.actions;

export default administratorSlice.reducer;
