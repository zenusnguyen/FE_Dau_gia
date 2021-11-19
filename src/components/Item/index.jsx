/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Text from "../Text";
import { Image } from "antd";
import styles from "./styles.module.css";
import { BACKEND_DOMAIN } from "../../constants";
import moment from "moment";
import TimeCount from "../TimeCount";

export default function Item(props) {
   const { product } = props;
   const [isEndTime, setIsEndTime] = useState(false);

   return (
      <div {...props} className={styles.ItemContainer}>
         <Image
            width={props?.width || 240}
            src={`${BACKEND_DOMAIN}${product.images[0]}`}
            alt={product.title}
            preview={false}
         />
         <div className={styles.name}>
            <Text.body title={product.title} />
         </div>
         <div className={styles.priceWrapper}>
            <Text.h3
               title={`${product.currentPrice
                  .toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
            />
            <Text.caption title={`[${product.view} lượt xem]`} />
         </div>
         <div className={styles.time}>
            <div className={styles.timeItem}>
               <Text.caption
                  title="Kết thúc sau: "
                  style={{ color: "#919293" }}
               />
            </div>
            <div className={styles.timeItem}>
               <TimeCount
                  productEndTime={product.endTime}
                  callBackTimeEnd={() => setIsEndTime(true)}
               >
                  <Text.caption />
               </TimeCount>
            </div>
         </div>
      </div>
   );
}
