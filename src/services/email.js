import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getOtp = (email) => {
  console.log("email: ", email);
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/getotp-verify`,
      data: { email: email },
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};
