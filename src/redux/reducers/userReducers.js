/* eslint-disable no-duplicate-case */
import { USER_ACTIONS } from "../actions/userActions";

const initialState = {
   user: {
      id: "617bb0495f4a4034c48c148d",
      name: "Nguyễn Minh Sang",
   },
};

const userStoreReducer = (state = initialState, action) => {
   switch (action.type) {
      case USER_ACTIONS.LOGIN: {
         const user = localStorage.getItem("user");
         const userData = JSON.parse(user);
         return { ...state, user: userData };
      }
      case USER_ACTIONS.LOGOUT: {
         localStorage.removeItem("user");
         return { ...state, user: {} };
      }
      default:
         return state;
   }
};
export default userStoreReducer;
