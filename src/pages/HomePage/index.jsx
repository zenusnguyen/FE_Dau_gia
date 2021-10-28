import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { socket } from "../../services/socket";
import SlideProduct from "../../components/SlideProduct";
import CategoryList from "../../components/CategoryList";
import { getAll as getAllProduct, search } from "../../services/productApi";
import { getAll as getAllCategory } from "../../services/categoryApi";
import LoadingPage from "../LoadingPage";

export default function HomePage() {
   const username = "anh";
   const room = "1";
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetch() {
         const test = await search();
         console.log("Search", test);
         Promise.all([getAllProduct(), getAllCategory()]).then((values) => {
            console.log(values[0]);
            setProducts(values[0]);
            setCategories(values[1]);
            setIsLoading(false);
         });
      }
      fetch();
   }, []);
   //  socket.on("welcome", (data) => {
   //     console.log("data: ", data);
   //  });

   const handleClick = () => {
      // socket.emit("join", { username, room }, (error) => {
      //   if (error) {
      //     alert(error);
      //   }
      // });
   };

   return (
      <div className={styles.homeContainer}>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               <CategoryList
                  title="Danh mục sản phẩm"
                  categories={categories}
               />
               <SlideProduct title="Sắp kết thúc" products={products} />
               <SlideProduct
                  title="Nhiều lượt ra giá nhất"
                  products={products}
               />
               <SlideProduct title="Giá cao nhất" products={products} />
            </div>
         )}

         {/* <Button onClick={handleClick}>connect</Button> */}
      </div>
   );
}
