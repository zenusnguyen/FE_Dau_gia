import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const get = (id) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/categories/${id}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const search = (searchWord) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/categories?_q=${searchWord}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

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

export const getById = (id) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "GET",
         url: `${BACKEND_DOMAIN}/categories/${id}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const add = (data) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "POST",
         url: `${BACKEND_DOMAIN}/categories`,
         data,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const update = (id, data) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "PUT",
         url: `${BACKEND_DOMAIN}/categories/${id}`,
         data,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};

export const del = (id) => {
   return new Promise((resolve, reject) => {
      axios({
         method: "DELETE",
         url: `${BACKEND_DOMAIN}/categories/${id}`,
      })
         .then((res) => {
            resolve(res?.data);
         })
         .catch((err) => reject(err));
   });
};
