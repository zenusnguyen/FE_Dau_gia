/* eslint-disable react/jsx-pascal-case */
import React from "react";
import Text from "../Text";
import { Image } from "antd";
import styles from "./styles.module.css";

export default function Item(props) {
   const { title, price, timming, description, view, src } = props;
   return (
      <div {...props} className={styles.ItemContainer}>
         <Image width={props?.width || 200} src={src} alt={title}></Image>
         <div className={styles.name}>
            <Text.body title={title}></Text.body>
            <Text.body title={description}></Text.body>
         </div>
         <div className={styles.priceWrapper}>
            <Text.h2 title={price}></Text.h2>
            <Text.caption title={`[${view} lượt]`}></Text.caption>
         </div>
         <div>
            <Text.caption title="Kết thúc sau:"></Text.caption>
            <span style={{ color: "red" }}>{timming} </span>
         </div>
      </div>
   );
}
