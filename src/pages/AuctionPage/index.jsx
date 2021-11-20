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
import { getAllBySender } from "../../services/evaluateApi";

export default function AuctionPage() {
  const { user } = useSelector((state) => state.user?.user);
  const [currentTab, setCurrentTab] = useState("a");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log("products: ", products);
  useEffect(() => {
    const fetchData = async () => {
      if (currentTab === "a") {
        const allAuction = await getAllByBidder(user.id);
        console.log('allAuction: ', allAuction);
        var productsId = [];
        if (allAuction) {
          if (Array.isArray(allAuction)) {
            productsId = allAuction.map((auction) => auction.productId);
          } else {
            productsId = [allAuction.productId];
          }
        }
        Promise.all([
          getAllAuctionProcessing(productsId),
          getWatchByBidder(user?.id),
        ]).then((values) => {
          const allLike = values[1].map((like) => like.productId);
          const products = values[0].map((value) => {
            return {
              ...value,
              isLike: allLike.includes(value.id),
            };
          });
          if (allAuction) setProducts(products);
          else setProducts([]);
          setIsLoading(false);
        });
      } else {
        Promise.all([getAllAuctionSold(user?.id), getAllBySender(user?.id)])
          .then((values) => {
            const allEvaluate = values[1].map((evaluate) => evaluate.productId);
            const products = values[0].map((value) => {
              return {
                ...value,
                isEvaluate: allEvaluate.includes(value.id),
              };
            });
            setProducts(products);
            setIsLoading(false);
          })
          .catch((error) => console.log(error));
      }
    };
    fetchData();
  }, [user, currentTab]);

  const onChangeTab = (e) => {
    //setIsLoading(true);
    console.log("e.target.value: ", e.target.value);
    setCurrentTab(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Text.h3 title="Tôi đấu giá" />
        <Radio.Group defaultValue="a" value={currentTab} onChange={onChangeTab}>
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
                <li key={product.id} className={styles.item}>
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
