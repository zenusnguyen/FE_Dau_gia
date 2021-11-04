import { BACKEND_DOMAIN } from "../constants/index";
import axios from "axios";

export const upLoadImages = (images) => {
  console.log("images: ", images);
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("files", images);
    axios
      .post("http://localhost:1337/upload", formData)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
        //handle error
      });
  });
};
