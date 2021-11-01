import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ProductItem from "../../components/ProductItem";
import Text from "../../components/Text";
import { useSelector } from "react-redux";
import { getAllLike } from "../../services/productApi";
import { getByBidder } from "../../services/wathApi";
import { Empty } from "antd";
import LoadingPage from "../LoadingPage";

export default function LikePage() {
   const { user } = useSelector((state) => state.user?.user);
   const [products, setProducts] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         const likes = await getByBidder(user.id);
         const productsLike = await getAllLike(
            likes.map((like) => like.productId)
         );
         setProducts(
            productsLike.map((productLike) => {
               return { ...productLike, isLike: true };
            })
         );
         setIsLoading(false);
      };
      fetchData();
   }, [user.id]);

   const callBackUnLike = (productId) => {
      const index = products.findIndex((product) => product.id === productId);
      products.splice(index, 1);
      setProducts([...products]);
   };

   return (
      <div className={styles.container}>
         <Text.h3 title="Danh sách yêu thích" />
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               {products.length > 0 ? (
                  <ul className={styles.productList}>
                     {products.map((product) => (
                        <li className={styles.productItem} key={product.id}>
                           <ProductItem
                              product={product}
                              callBackUnLike={callBackUnLike}
                           />
                        </li>
                     ))}
                  </ul>
               ) : (
                  <Empty
                     style={{
                        top: "50%",
                        position: "absolute",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                     }}
                  />
               )}
            </div>
         )}
      </div>
   );
}
