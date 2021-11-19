import { WindowsOutlined } from "@ant-design/icons";

export const USER_ACTIONS = {
  LOGIN: "USER_LOGIN_ACTION",
  LOGOUT: "USER_LOGOUT_ACTION",
};

export function login(user) {
  return {
    type: USER_ACTIONS.LOGIN,
    payload: user,
  };
}

export function logout() {
  return {
    type: USER_ACTIONS.LOGOUT,
  };
}
