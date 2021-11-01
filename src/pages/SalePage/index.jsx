import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ProductImage from "../../assets/product.svg";
import SellProductItem from "../../components/SellProductItem";
import { useSelector } from "react-redux";
import { Radio, Empty } from "antd";
import Text from "../../components/Text";
import LoadingPage from "../LoadingPage";
import {
   getAllSellProcessing,
   getAllSellSold,
} from "../../services/productApi";

export default function SalePage() {
   const { user } = useSelector((state) => state.user?.user);
   const [isLoading, setIsLoading] = useState(true);
   const [products, setProducts] = useState([]);

   const [currentTab, setCurrentTab] = useState("a");

   useEffect(() => {
      const fetchData = async () => {
         if (currentTab === "a") {
            Promise.all([getAllSellProcessing(user.id)]).then((values) => {
               setProducts(values[0]);
               setIsLoading(false);
            });
         } else {
            Promise.all([getAllSellSold(user.id)]).then((values) => {
               setProducts(values[0]);
               setIsLoading(false);
            });
         }
      };
      fetchData();
   }, [user.id, currentTab]);

   const onChangeTab = (e) => {
      setIsLoading(true);
      setCurrentTab(e.target.value);
      console.log("radio checked", e.target.value);
   };

   return (
      <div className={styles.container}>
         <div className={styles.top}>
            <Text.h3 title="Tôi đấu giá" />
            <Radio.Group
               defaultValue="a"
               defaultValue="a"
               value={currentTab}
               style={{ marginTop: 16 }}
               onChange={onChangeTab}
            >
               <Radio.Button value="a">
                  <Text.caption title="Còn hạn" />
               </Radio.Button>
               <Radio.Button value="b">
                  <Text.caption title="Hết hạn" />
               </Radio.Button>
            </Radio.Group>
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               {products.length > 0 ? (
                  <ul className={styles.list}>
                     {products.map((product) => (
                        <li className={styles.item}>
                           <SellProductItem product={product} />
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
