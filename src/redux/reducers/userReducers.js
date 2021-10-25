/* eslint-disable no-duplicate-case */
import { USER_ACTIONS } from "../actions/userActions";

const initialState = {
  user: {},
};

const userStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_ACTIONS.LOGIN: {
      return { ...state, user: action.payload };
    }
    case USER_ACTIONS.LOGIN: {
      localStorage.removeItem("user");
      return { ...state, user: {} };
    }
    default:
      return state;
  }
};
export default userStoreReducer;
