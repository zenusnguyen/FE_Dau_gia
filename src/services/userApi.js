import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getAll = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/user-infos`,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

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

export const search = (searchWord) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/user-infos?_q=${searchWord}`,
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
      url: `${BACKEND_DOMAIN}/user-infos`,
      data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const updateInfo = (userId, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "PUT",
      url: `${BACKEND_DOMAIN}/user-infos/${userId}`,
      data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const updatePassword = (userId, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "PUT",
      url: `${BACKEND_DOMAIN}/user-infos?id=${userId}`,
      data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err.response));
  });
};

export const resetPassword = (userId, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "PUT",
      url: `${BACKEND_DOMAIN}/user-infos/resetPassword/${userId}`,
      data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err.response));
  });
};

export const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${BACKEND_DOMAIN}/user-infos`, { params: { id: userId } })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};
