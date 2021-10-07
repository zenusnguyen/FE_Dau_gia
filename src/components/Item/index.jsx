/* eslint-disable react/jsx-pascal-case */
import React from "react";
import Text from "../Text";
import { Image } from "antd";
import styles from "./styles.module.css";

export default function Item(props) {
   const { title, price, timming, view, src } = props;
   return (
      <div {...props} className={styles.ItemContainer}>
         <Image
            width={props?.width || 200}
            src={src}
            alt={title}
            preview={false}
         />
         <div className={styles.name}>
            <Text.body title={title} />
         </div>
         <div className={styles.priceWrapper}>
            <Text.h3 title={price} />
            <Text.caption title={`[${view} lượt]`} />
         </div>
         <div>
            <Text.caption title="Kết thúc sau: " style={{ color: "#919293" }} />
            <Text.caption title={timming} style={{ color: "red" }} />
         </div>
      </div>
   );
}
