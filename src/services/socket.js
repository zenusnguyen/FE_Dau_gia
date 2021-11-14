import io from "socket.io-client";
let STRAPI_ENDPOINT;

if (process.env.NODE_ENV !== "production") {
  STRAPI_ENDPOINT = "http://localhost:1337";
} else {
  STRAPI_ENDPOINT = process.env.REACT_APP_SERVER_URL;
}
console.log('STRAPI_ENDPOINT: ', STRAPI_ENDPOINT);
export const socket = io(STRAPI_ENDPOINT);

