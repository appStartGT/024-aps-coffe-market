import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAxios } from '@hooks';
import { personUrl } from '@config/endpointConfig';
import { personDto } from '@dto';

const { callService } = useAxios();

export const personListAction = createAsyncThunk(
  'person/list',
  async (params, { rejectWithValue }) => {
    return await callService({
      url: personUrl.list,
      errorCallback: rejectWithValue,
    }).get({ params });
  }
);

export const createPersonAction = createAsyncThunk(
  'person/create',
  async (data, { rejectWithValue }) => {
    const body = personDto.post(data);
    return await callService({
      url: personUrl.create,
      errorCallback: rejectWithValue,
    }).post(body);
  }
);

export const updatePersonAction = createAsyncThunk(
  'person/update',
  async (data, { rejectWithValue }) => {
    const body = personDto.put(data);
    return await callService({
      url: personUrl.put,
      errorCallback: rejectWithValue,
    }).put(body);
  }
);

export const deletePersonAction = createAsyncThunk(
  'person/delete',
  async ({ id_person }, { rejectWithValue }) => {
    return await callService({
      url: personUrl.delete(id_person),
      errorCallback: rejectWithValue,
    }).delete();
  }
);

export const setUserThemeAction = createAsyncThunk(
  'person/setUserTheme',
  async (data, { rejectWithValue }) => {
    return await callService({
      url: personUrl.theme,
      errorCallback: rejectWithValue,
    }).post(data);
  }
);

const initialState = {
  personList: [],
  selectedPerson: undefined,
  isPersonModalOpen: false,
  isDeleteModalOpen: false,
  processing: false,
  actionStatus: null,
};

export const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {
    setPersonAction: (state, action) => {
      state.selectedPerson = action.payload;
    },
    setPersonModalAction: (state, action) => {
      state.isPersonModalOpen = action.payload;
    },
    setDeleteModalAction: (state, action) => {
      state.isDeleteModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* User list */
    builder.addCase(personListAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(personListAction.rejected, (state, action) => {
      console.log(action);
      state.processing = false;
    });
    builder.addCase(
      personListAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.personList = personDto.get(payload.data.data);
        state.processing = false;
      }
    );
    /* Create User */
    builder.addCase(createPersonAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(createPersonAction.rejected, (state, action) => {
      console.log(action);
      state.processing = false;
    });
    builder.addCase(
      createPersonAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.personList.unshift(personDto.get(payload.data));
        state.isPersonModalOpen = false;
        state.processing = false;
        state.selectedPerson = {};
      }
    );
    /* Update User */
    builder.addCase(updatePersonAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(updatePersonAction.rejected, (state, action) => {
      console.log('action', action);
      state.processing = false;
    });
    builder.addCase(
      updatePersonAction.fulfilled,
      (state, { payload: { payload } }) => {
        const updatedPerson = personDto.get(payload.data);
        const index = state.personList.findIndex(
          (person) => person.id_person == updatedPerson.id_person
        );
        state.personList[index] = {
          ...state.personList[index],
          ...updatedPerson,
        };
        state.isPersonModalOpen = false;
        state.processing = false;
        state.selectedPerson = undefined;
      }
    );
    /* Delete */
    builder.addCase(deletePersonAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(deletePersonAction.rejected, (state, action) => {
      state.error = action;
      state.processing = false;
    });
    builder.addCase(
      deletePersonAction.fulfilled,
      (state, { payload: { payload } }) => {
        state.personList = state.personList.filter(
          (person) => +person.id_person !== +payload.data.id_person
        );
        state.processing = false;
        state.isDeleteModalOpen = false;
        state.selectedPerson = null;
      }
    );
    /* set user theme */
    builder.addCase(setUserThemeAction.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(setUserThemeAction.rejected, (state, action) => {
      console.log('action', action);
      state.processing = false;
    });
    builder.addCase(
      setUserThemeAction.fulfilled,
      (state /* , { payload: { payload } } */) => {
        state.processing = false;
      }
    );
  },
});

export const { setPersonAction, setPersonModalAction, setDeleteModalAction } =
  personSlice.actions;

export default personSlice.reducer;
