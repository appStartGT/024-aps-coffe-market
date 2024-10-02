import { ACTIONS } from '../actions/login.actions';

const initialState = {
  isLoggedIn: false,
};

const loginReducer = function (state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SING_IN: {
      const { isLoggin } = action.payload;
      return {
        ...state,
        isLoggedIn: isLoggin,
      };
    }

    default: {
      return state;
    }
  }
};

export default loginReducer;
