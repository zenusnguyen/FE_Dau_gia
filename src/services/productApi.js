import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getAll = () => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const get = (id) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/${id}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getBySubCategory = (subId, pageNumber) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/sub-category/${subId}/page/${pageNumber}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getCountBySub = (subId) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/sub-category/${subId}/count`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getViewDesc = () => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/view/desc`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getPriceDesc = () => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/price/desc`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getPostDateAsc = () => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/post-date/asc`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const search = (keyWord, pageNumber) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/search/${keyWord}/page/${pageNumber}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getCountSearch = (searchWord) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/items/search/${searchWord}/count`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const getAllHistory = (productID) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/price-histories/product/${productID}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};
