import React, { useState } from "react";
import styles from "./styles.module.css";
import ProductImage from "../../assets/product.svg";
import ProductItem from "../../components/ProductItem";
import { PageHeader, Radio } from "antd";
const products = [
  {
    id: "5",
    title:
      "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
    price: "1.250.000đ",
    view: "20",
    timming: "12d 8h 5m",
    src: ProductImage,
    width: 240,
    bidder: { name: "***Anh", percent: 80 },
    postingDate: "02/09/2021 10:30",
    auctionMoney: "1.300.000đ",
    buyNow: "1.500.000đ",
    status: "processing",
  },
  {
    id: "5",
    title:
      "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
    price: "1.250.000đ",
    view: "20",
    timming: "12d 8h 5m",
    src: ProductImage,
    width: 240,
    bidder: { name: "***Anh", percent: 80 },
    postingDate: "02/09/2021 10:30",
    auctionMoney: "1.300.000đ",
    buyNow: null,
    status: "sold",
  },
];

export default function LikePage() {
  const options = [
    { label: "Tất cả", value: "all" },
    { label: "Hết hạn", value: "expired" },
    { label: "Còn hạn", value: "due" },
  ];

  const [currentValue, setCurrentValue] = useState("");
  return (
    <div className={styles.container}>
      <PageHeader
        title={"Tôi đấu giá"}
        extra={[
          <Radio.Group
            options={options}
            onChange={() => {}}
            value={currentValue}
            optionType="button"
            buttonStyle="solid"
          />,
        ]}
      ></PageHeader>

      <div>
        {products.map((product) => (
          <ProductItem
            key={product.id}
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
            status={product?.status}
          />
        ))}
      </div>
    </div>
  );
}
