import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getAll = () => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/categories`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};
