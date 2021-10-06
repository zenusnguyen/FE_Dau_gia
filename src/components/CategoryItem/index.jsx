import React from "react";
import styles from "./styles.module.css";
import { Image } from "antd";
import Text from "../Text";

export default function CategoryItem(props) {
   return (
      <div className={styles.CategoryItem} {...props}>
         <div className={styles.image}>
            <Image src={props?.src} width={80} preview={false}></Image>
         </div>
         <Text.h3 title={props?.title} />
      </div>
   );
}
