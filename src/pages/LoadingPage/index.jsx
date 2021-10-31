import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

export default function LoadingPage(props) {
   const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
   return (
      <div className={styles.loadingPage}>
         <Spin indicator={antIcon} />
      </div>
   );
}
