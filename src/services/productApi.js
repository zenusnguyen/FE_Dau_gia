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

export const getTheSame = (id, subId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items?id_nin=${id}&status=processing&subCategoryId=${subId}`,
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
      url: `${BACKEND_DOMAIN}/items?subCategoryId=${subId}&_limit=2&_start=${
        2 * (pageNumber - 1)
      }&status=processing`,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const getByCategory = (categoryId, pageNumber) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items?categoryID=${categoryId}`,
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
      url: `${BACKEND_DOMAIN}/items/count?subCategoryId=${subId}&status=processing`,
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
      url: `${BACKEND_DOMAIN}/items?status=processing&_sort=postingDate:ASC&_limit=5`,
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
      url: `${BACKEND_DOMAIN}/items?status=processing&_sort=currentPrice:DESC&_limit=5`,
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
      url: `${BACKEND_DOMAIN}/items?status=processing&_sort=postingDate:ASC&_limit=5`,
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

export const getAllLike = (productsId) => {
  var query = "";
  productsId.map((productId) => {
    return (query = query + `id_in=${productId}&`);
  });
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items?${query}&status=processing`,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const getAllAuctionProcessing = (productsId) => {
  var query = "";
  productsId.map((productId) => {
    return (query = query + `id_in=${productId}&`);
  });
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items?${query}&status=processing`,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const getAllAuctionSold = (bidderId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items?status=expired&currentBidderId=${bidderId}`,
    }).catch((err) => reject(err));
  });
};

export const getAllSellProcessing = (ownerId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items?status=processing&ownerId=${ownerId}`,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};

export const getAllSellSold = (ownerId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${BACKEND_DOMAIN}/items?status=expired&ownerId=${ownerId}`,
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

export const createProduct = (product) => {
  console.log("product: ", product);
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/items`,
      data: product,
    })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((err) => reject(err));
  });
};
