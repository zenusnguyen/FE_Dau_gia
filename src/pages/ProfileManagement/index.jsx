import React, { useState } from "react";
import SideMenu from "../../components/SideMenu";
import styles from "./styles.module.css";
import SalePage from "../SalePage";
import AuctionPage from "../AuctionPage";
import LikePage from "../LikePage";
import InfoAccountPage from "../InfoAccountPage";
import EvaluatePage from "../EvaluatePage";
import AddProductPage from "../AddProductPage";

export default function ProfileManagement() {
   const [currentKey, setCurrentKey] = useState("4");

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
         // code block
      }
   };

   return (
      <div className={styles.container}>
         <SideMenu handleClick={setCurrentKey}></SideMenu>
         {renderComponent()}
      </div>
   );
}
