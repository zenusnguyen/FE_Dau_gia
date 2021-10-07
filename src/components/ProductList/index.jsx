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
                  <ProductItem
                     id={product.id}
                     title={product.title}
                     price={product.price}
                     view={product.view}
                     timming={product.timming}
                     src={product.src}
                     width={product.width}
                     bidder={product.bidder}
                     postingDate={product.postingDate}
                     auctionMoney={product.auctionMoney}
                     buyNow={product.buyNow}
                  />
               </li>
            ))}
         </ul>
      </div>
   );
}
