import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const add = (
   senderId,
   senderName,
   receiverId,
   content = "",
   score,
   time,
   productId
) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "POST",
         url: `${BACKEND_DOMAIN}/evaluates`,
         data: {
            senderId,
            senderName,
            receiverId,
            content,
            score,
            time,
            productId,
         },
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getByUser = (userId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/evaluates?receiverId=${userId}&_sort=time:DESC`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getAllBySender = (senderId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/evaluates?senderId=${senderId}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};
