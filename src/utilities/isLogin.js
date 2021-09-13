export function isLogin() {
  const user = localStorage.getItem("user");
  return user?.jwt !== undefined ? true : false;
}
