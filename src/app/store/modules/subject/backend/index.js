import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { subjectlUrl } from '@config/endpointConfig';

const { callService } = useAxios();

export const subjectListAction = createAsyncThunk(
  'subject/list',
  async (params, { rejectWithValue }) => {
    return await callService({
      url: subjectlUrl.list,
      errorCallback: rejectWithValue,
    }).get();
  }
);

const initialState = {
  processing: false,
  selectedSubject: null,
  subjectList: [],
};

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    setSubjectAction: (state, action) => {
      state.selectedSubject = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* Role list */
    builder.addCase(subjectListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      subjectListAction.rejected,
      (state, { payload: { payload } }) => {
        console.log({ payload });
        state.processing = false;
      }
    );
    builder.addCase(
      subjectListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.subjectList = payload.data;
        state.processing = false;
      }
    );
  },
});

export const { setSubjectAction } = subjectSlice.actions;

export default subjectSlice.reducer;
