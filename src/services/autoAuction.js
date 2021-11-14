import axios from "axios";
import { BACKEND_DOMAIN } from "../constants/index";

export const createAutoAuctionTransaction = (data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/auto-auctions`,
      data,
    })
      .then((res) => {
        resolve(res?.data[0]);
      })
      .catch((err) => reject(err));
  });
};
