import React, { useState } from "react";
import SideMenu from "../../components/SideMenu";
import styles from "./styles.module.css";
import SalePage from "../SalePage";
import AuctionPage from "../AuctionPage";
import LikePage from "../LikePage";
import InfoAccountPage from "../InfoAccountPage";
import EvaluatePage from "../EvaluatePage";
import AddProductPage from "../AddProductPage";
import { Breadcrumb } from "antd";
import Text from "../../components/Text";

export default function ProfileManagement() {
   const [currentKey, setCurrentKey] = useState("1");
   const [breadcrumb, setBreadcrumb] = useState(["Thông tin tài khoản"]);

   const renderComponent = () => {
      switch (currentKey) {
         case "1":
            return <InfoAccountPage />;
         case "2":
            return <EvaluatePage />;
         case "5":
            return <AddProductPage />;
         case "6":
            return <SalePage></SalePage>;
         case "7":
            return <AuctionPage></AuctionPage>;
         case "8":
            return <LikePage></LikePage>;
         default:
      }
   };

   return (
      <div className={styles.container}>
         <Breadcrumb style={{ marginBottom: "30px" }}>
            <Breadcrumb.Item>
               <Text.caption title="Trang chủ" />
            </Breadcrumb.Item>
            {breadcrumb.map((item) => (
               <Breadcrumb.Item>
                  <Text.caption title={item} />
               </Breadcrumb.Item>
            ))}
         </Breadcrumb>
         <div className={styles.content}>
            <SideMenu
               handleClick={setCurrentKey}
               currentKey={currentKey}
               updateBreadcrumb={setBreadcrumb}
            ></SideMenu>
            {renderComponent()}
         </div>
      </div>
   );
}
