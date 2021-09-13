export function isLogin() {
  const user = localStorage.getItem("user");
  const userData = JSON.parse(user)
  console.log('userData: ', userData);
  return userData?.jwt !== undefined ? true : false;
}
