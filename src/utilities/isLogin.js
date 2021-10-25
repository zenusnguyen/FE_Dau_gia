export function isLogin() {
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user);
  return userData?.jwt !== undefined ? true : false;
}
