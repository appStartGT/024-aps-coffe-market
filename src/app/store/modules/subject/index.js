import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cleanModel } from '@utils';
import {
  getDataFrom,
  insertInto,
  updateRecordBy,
} from '@utils/firebaseMethods';

export const subjectListAction = createAsyncThunk(
  'subject/list',
  async (_params, { rejectWithValue }) => {
    return await getDataFrom({ collectionName: 'subject' })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const subjectCreateAction = createAsyncThunk(
  'subject/create',
  async (data, { rejectWithValue }) => {
    data = cleanModel(data);
    return await insertInto({
      collectionName: 'subject',
      data: { ...data, key: 'id_subject' },
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

export const subjectCreateActionAction = createAsyncThunk(
  'subject/createAction',
  async (data, { rejectWithValue, getState }) => {
    const id_subject = getState().subject.selectedSubject.id_subject;
    return await updateRecordBy({
      collectionName: 'subject',
      filterBy: [
        {
          field: 'id_subject',
          condition: '==',
          value: id_subject,
        },
      ],

      data: { actions: data },
    })
      .then((res) => res)
      .catch((res) => rejectWithValue(res));
  }
);

const initialState = {
  processing: false,
  selectedSubject: null,
  actions: [],
  subjectList: [],
};

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    setSubjectAction: (state, { payload }) => {
      state.selectedSubject = payload;
      state.actions = payload?.actions || [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(subjectListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(subjectListAction.rejected, (state, { payload }) => {
      console.error({ payload });
      state.processing = false;
    });
    builder.addCase(subjectListAction.fulfilled, (state, { payload }) => {
      state.subjectList = payload.data;
      state.processing = false;
    });
    /*  CREATE */
    builder.addCase(subjectCreateAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(subjectCreateAction.rejected, (state, { payload }) => {
      console.error(payload);
      state.error = payload;
      state.processing = false;
    });
    builder.addCase(subjectCreateAction.fulfilled, (state, { payload }) => {
      state.subjectList.unshift(payload);
      state.processing = false;
    });

    /*  CREATE ACTION*/
    builder.addCase(subjectCreateActionAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(
      subjectCreateActionAction.rejected,
      (state, { payload }) => {
        console.error(payload);
        state.error = payload;
        state.processing = false;
      }
    );
    builder.addCase(
      subjectCreateActionAction.fulfilled,
      (state, { payload }) => {
        //update item
        const id_subject = state.selectedSubject.id_subject;

        state.subjectList = state.subjectList.map((sub) =>
          sub.id_subject == id_subject
            ? { ...sub, actions: payload.actions }
            : sub
        );
        state.selectedSubject.actions = payload.actions;
        state.actions = payload.actions;
        state.processing = false;
      }
    );
  },
});

export const { setSubjectAction } = subjectSlice.actions;

export default subjectSlice.reducer;
