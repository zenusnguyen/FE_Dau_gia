/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-pascal-case */
import React from "react";
import Text from "../Text";
import { Image } from "antd";
import styles from "./styles.module.css";
const oneDay = 24 * 60 * 60 * 1000;

export default function Item(props) {
   const { title, startPrice, view, images, createdAt } = props;
   const timming = "12 days";

   return (
      <div {...props} className={styles.ItemContainer}>
         <Image
            width={props?.width || 200}
            src={images[0]}
            alt={title}
            preview={false}
         />
         <div className={styles.name}>
            <Text.body title={title} />
         </div>
         <div className={styles.priceWrapper}>
            <Text.h3 title={startPrice} />
            <Text.caption title={`[${view} lượt]`} />
         </div>
         <div>
            <Text.caption title="Kết thúc sau: " style={{ color: "#919293" }} />
            <Text.caption title={timming} style={{ color: "red" }} />
         </div>
      </div>
   );
}
