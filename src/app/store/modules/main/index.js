import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mainDrawer: {
    isOpen: false,
  },
  currentModule: null,
  mainView: {
    loadingHeader: false,
    loadingBody: false,
  },
  components: {
    tabComponent: { value: 0 },
    apsGlobalModalProps: { open: false }, //ApsModalProps
  },
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    toggleMainDrawer: (state /* , action */) => {
      const toogle = !state.mainDrawer.isOpen;
      state.mainDrawer.isOpen = toogle;
    },
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload;
    },
    setMainViewAction: (state, action) => {
      state.mainView = { ...state.mainView, ...action.payload };
    },
    setLoadingMainViewAction: (state, action) => {
      const loading = Boolean(action.payload);
      state.mainView = { loadingBody: loading, loadingHeader: loading };
    },
    setTabSelection: (state, action) => {
      const currentValue = state.components.tabComponent.value;
      const newValue = action.payload;
      state.components.tabComponent.value = { ...currentValue, ...newValue };
    },
    setApsGlobalModalPropsAction: (state, action) => {
      const newValue = action.payload;
      state.components.apsGlobalModalProps = {...newValue};
    },
  },
});

export const {
  setApsGlobalModalPropsAction,
  setCurrentModule,
  setLoadingMainViewAction,
  setMainViewAction,
  setTabSelection,
  toggleMainDrawer,
} = mainSlice.actions;

export default mainSlice.reducer;
