/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Text from "../Text";
import { Image } from "antd";
import styles from "./styles.module.css";
import { BACKEND_DOMAIN } from "../../constants";
import moment from "moment";

export default function Item(props) {
   const { product } = props;
   const [timeRemaining, setTimeRemaining] = useState("");

   useEffect(() => {
      const currentTime = moment();
      const endTime = moment(product.postingDate).add(5, "day");
      const hours = endTime.diff(currentTime, "hours");
      const day = endTime.diff(currentTime, "days");
      if (day > 0) {
         setTimeRemaining(`${day}d ${hours - 24 * day}h`);
      } else {
         setTimeRemaining(`${hours}h`);
      }
   }, [product]);

   return (
      <div {...props} className={styles.ItemContainer}>
         <Image
            width={props?.width || 200}
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
            <Text.caption title={`[${product.view} lượt]`} />
         </div>
         <div>
            <Text.caption title="Kết thúc sau: " style={{ color: "#919293" }} />
            <Text.caption title={timeRemaining} style={{ color: "red" }} />
         </div>
      </div>
   );
}
