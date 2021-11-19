import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getLastBidder = (productId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/price-histories?productId=${productId}&_limit=1&_sort=price:DESC`,
      })
         .then((res) => {
            resolve(res?.data[0]);
         })
         .catch((err) => reject(err));
   });
};

export const getAllByProduct = (productId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/price-histories?productId=${productId}&_sort=price:ASC`,
      })
         .then((res) => {
            resolve(res?.data[0]);
         })
         .catch((err) => reject(err));
   });
};

export const getCountByProduct = (productId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/price-histories/count?productId=${productId}`,
      })
         .then((res) => {
            resolve(res?.data[0]);
         })
         .catch((err) => reject(err));
   });
};

export const getAllByBidder = (bidderId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/price-histories?bidderId=${bidderId}`,
      })
         .then((res) => {
            resolve(res?.data[0]);
         })
         .catch((err) => reject(err));
   });
};

export const createAuctionTransaction = (data) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "POST",
         url: `${BACKEND_DOMAIN}/price-histories`,
         data,
      })
         .then((res) => {
            resolve(res?.data[0]);
         })
         .catch((err) => reject(err));
   });
};
