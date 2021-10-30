import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ProductItem from "../../components/ProductItem";
import Text from "../../components/Text";
import { useSelector } from "react-redux";
import { getAllLike } from "../../services/productApi";
import { Empty } from "antd";

export default function LikePage() {
   const { user } = useSelector((state) => state.user);
   const [products, setProducts] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         const productsLike = await getAllLike(user.id);
         setProducts(productsLike);
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
   );
}
