import React from "react";
import ProductItem from "../ProductItem";
import styles from "./styles.module.css";

export default function ProductList(props) {
   const { products } = props;
   return (
      <div className={styles.productListContainer}>
         <ul className={styles.list}>
            {products.map((product) => (
               <li className={styles.item} key={product.id}>
                  <ProductItem product={product} />
               </li>
            ))}
         </ul>
      </div>
   );
}
