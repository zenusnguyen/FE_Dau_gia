import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const getOtp = (email) => {
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

export const sendWinnerBidderMail = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/sendWinnerBidderMail`,
      data: data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const sendRejectNotification = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/sendRejectNotification`,
      data: data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const sendAuctionFailNotification = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/sendAuctionFailNotification`,
      data: data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const sendAuctionSuccessNotification = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/sendAuctionSuccessNotification`,
      data: data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const sendSellerNotification = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/sendSellerNotification`,
      data: data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const sendBidderNotification = (data) => {
  console.log("data: ", data);
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/sendBidderNotification`,
      data: data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const sendPreBidderNotification = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/sendPreBidderNotification`,
      data: data,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};
