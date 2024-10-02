import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTheme: false,
  palette: 'defaultPalette',
};

export const themeConfig = createSlice({
  name: 'configTheme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.selectedTheme = !state.selectedTheme;
      state.palette = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTheme } = themeConfig.actions;

export default themeConfig.reducer;
