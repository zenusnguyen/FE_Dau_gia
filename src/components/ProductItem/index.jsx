/* eslint-disable react/jsx-pascal-case */
import React from "react";
import Text from "../Text";
import { Image, Button, Divider } from "antd";
import styles from "./styles.module.css";

export default function ProductItem(props) {
   const { title, price, timming, description, view, src } = props;
   return (
      <div {...props} className={styles.productItemContainer}>
         <Image width={props?.width || 200} src={src} alt={title}></Image>
         <div className={styles.info}>
            <div className={styles.name}>
               <Text.h3 title={title}></Text.h3>
            </div>
            <Divider style={{ margin: "20px 0" }} />
            <div className={styles.infoCenter}>
               <div className={styles.infoCenterLeft}>
                  <div className={styles.priceWrapper}>
                     <Text.caption
                        title="Giá hiện tại"
                        style={{ color: "#919293" }}
                     />
                     <Text.h2 title={price} />
                  </div>
               </div>
               <div className={styles.infoCenterRight}>
                  <div>
                     <div className={styles.timming}>
                        <Text.caption
                           title="Kết thúc sau"
                           style={{ color: "#919293" }}
                        />
                        <Text.h3 title={timming} style={{ color: "red" }} />
                     </div>
                     <div className={styles.view}>
                        <Text.caption
                           title="Số lượt ra giá"
                           style={{ color: "#919293" }}
                        />
                        <Text.bodyHighlight title={`${view} Lượt`} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className={styles.actions}>
            <Button type="primary">Primary Button</Button>{" "}
            <Button type="primary">Primary Button</Button>{" "}
            <Button type="primary">Primary Button</Button>
         </div>
      </div>
   );
}
