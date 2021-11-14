import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { socket } from "../../services/socket";
import SlideProduct from "../../components/SlideProduct";
import CategoryList from "../../components/CategoryList";
import {
   getAll as getAllProduct,
   search,
   getViewDesc,
   getPriceDesc,
   getPostDateAsc,
} from "../../services/productApi";
import { getAll as getAllCategory } from "../../services/categoryApi";
import LoadingPage from "../LoadingPage";

export default function HomePage() {
   const [productsDescView, setProductsDescView] = useState([]);
   const [productsDescPrice, setProductsDescPrice] = useState([]);
   const [productsDescPostDate, setProductsDescPostDate] = useState([]);
   const [categories, setCategories] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetch() {
         Promise.all([
            getAllCategory(),
            getViewDesc(),
            getPriceDesc(),
            getPostDateAsc(),
         ]).then((values) => {
            setCategories(values[0]);
            setIsLoading(false);
            setProductsDescView(values[1]);
            setProductsDescPrice(values[2]);
            setProductsDescPostDate(values[3]);
         });
      }
      fetch();
   }, []);

   return (
      <div className={styles.homeContainer}>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               {/* <CategoryList title="Danh mục sản phẩm" categories={categories} /> */}
               <SlideProduct
                  title="Sắp kết thúc"
                  products={productsDescPostDate}
               />
               <SlideProduct
                  title="Nhiều lượt ra giá nhất"
                  products={productsDescView}
               />
               <SlideProduct
                  title="Giá cao nhất"
                  products={productsDescPrice}
               />
            </div>
         )}
      </div>
   );
}
