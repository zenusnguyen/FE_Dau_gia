import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getByBidder = (bidderId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/watches?bidderId=${bidderId}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const add = (productId, bidderId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "POST",
         url: `${BACKEND_DOMAIN}/watches`,
         data: {
            productId: productId,
            bidderId: bidderId,
         },
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const del = (productId, bidderId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "DELETE",
         url: `${BACKEND_DOMAIN}/watches/${productId}/${bidderId}`,
         data: {
            productId: productId,
            bidderId: bidderId,
         },
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};
