import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import styles from "./styles.module.css";
import SalePage from "../SalePage";
import AuctionPage from "../AuctionPage";
import LikePage from "../LikePage";
import InfoAccountPage from "../InfoAccountPage";
import EvaluatePage from "../EvaluatePage";
import AddProductPage from "../AddProductPage";
import LoadingPage from "../LoadingPage";

export default function ProfileManagement() {
   const { page } = useParams();
   const [currentKey, setCurrentKey] = useState("1");
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (page === "like-list") {
         setCurrentKey("8");
      }
      setIsLoading(false);
   }, [page]);

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
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div className={styles.content}>
               <SideMenu
                  handleClick={setCurrentKey}
                  currentKey={currentKey}
               ></SideMenu>
               {renderComponent()}
            </div>
         )}
      </div>
   );
}
