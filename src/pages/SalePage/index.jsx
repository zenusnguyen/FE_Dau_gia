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
   getAllSellExpired,
} from "../../services/productApi";

export default function SalePage() {
   const { user } = useSelector((state) => state.user?.user);
   const [isLoading, setIsLoading] = useState(true);
   const [products, setProducts] = useState([]);

   const [currentTab, setCurrentTab] = useState("a");

   useEffect(() => {
      setIsLoading(true);
      const fetchData = async () => {
         if (currentTab === "a") {
            getAllSellProcessing(user?.id).then((values) => {
               if (Array.isArray(values)) setProducts(values);
               else setProducts([values]);
               setIsLoading(false);
            });
         } else if (currentTab === "b") {
            getAllSellExpired(user?.id).then((values) => {
               if (Array.isArray(values)) setProducts(values);
               else setProducts([values]);
               setIsLoading(false);
            });
         } else {
            getAllSellSold(user?.id).then((values) => {
               if (Array.isArray(values)) setProducts(values);
               else setProducts([values]);
               setIsLoading(false);
            });
         }
      };
      fetchData();
   }, [currentTab, user]);

   const onChangeTab = (e) => {
      setCurrentTab(e.target.value);
   };

   return (
      <div className={styles.container}>
         <div className={styles.top}>
            <Text.h3 title="Tôi đang bán" />
            <Radio.Group
               defaultValue="a"
               value={currentTab}
               onChange={onChangeTab}
            >
               <Radio.Button value="a">
                  <Text.caption title="Còn hạn" />
               </Radio.Button>
               <Radio.Button value="b">
                  <Text.caption title="Hết hạn" />
               </Radio.Button>
               <Radio.Button value="c">
                  <Text.caption title="Đã bán" />
               </Radio.Button>
            </Radio.Group>
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               {products?.length > 0 ? (
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
