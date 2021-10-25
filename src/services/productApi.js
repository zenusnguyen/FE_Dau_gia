import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getAll = () => {
  console.log("hihi");
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items`,
    })
      .then((res) => {
        console.log("res: ", res);
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};
