import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getById = (userId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/user-infos/${userId}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};
