import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import ProductItem from "../../components/ProductItem";
import { useSelector } from "react-redux";
import { Radio, Empty } from "antd";
import Text from "../../components/Text";
import {
   getAllAuctionProcessing,
   getAllAuctionSold,
} from "../../services/productApi";
import LoadingPage from "../LoadingPage";
import { getByBidder as getWatchByBidder } from "../../services/wathApi";
import { getAllByBidder } from "../../services/priceHistoryApi";

export default function AuctionPage() {
   const { user } = useSelector((state) => state.user);
   const [currentTab, setCurrentTab] = useState("a");
   const [products, setProducts] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         if (currentTab === "a") {
            const allAuction = await getAllByBidder(user.id);
            var productsId;
            if (allAuction.isArray) {
               productsId = allAuction.map((auction) => auction.productId);
            } else {
               productsId = [allAuction.productId];
            }
            Promise.all([
               getAllAuctionProcessing(productsId),
               getWatchByBidder(user.id),
            ]).then((values) => {
               const allLike = values[1].map((like) => like.productId);
               const products = values[0].map((value) => {
                  if (allLike.includes(value.id)) {
                     return {
                        ...value,
                        isLike: true,
                     };
                  } else {
                     return {
                        ...value,
                        isLike: false,
                     };
                  }
               });
               setProducts(products);
               setIsLoading(false);
            });
         } else {
            Promise.all([getAllAuctionSold(user.id)]).then((values) => {
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
   };

   return (
      <div className={styles.container}>
         <div className={styles.top}>
            <Text.h3 title="Tôi đấu giá" />
            <Radio.Group
               defaultValue="a"
               value={currentTab}
               style={{ marginTop: 16 }}
               onChange={onChangeTab}
            >
               <Radio.Button value="a">
                  <Text.caption title="Đang đấu giá" />
               </Radio.Button>
               <Radio.Button value="b">
                  <Text.caption title="Đã thắng" />
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
                           <ProductItem product={product} />
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
