import React, { useState } from "react";
import SideMenuAdmin from "../../components/SideMenuAdmin";
import styles from "./styles.module.css";
import SalePage from "../SalePage";
import AuctionPage from "../AuctionPage";
import LikePage from "../LikePage";
import EvaluatePage from "../EvaluatePage";
import AddProductPage from "../AddProductPage";
import { Breadcrumb } from "antd";
import Text from "../../components/Text";
import CategoryManagePage from "../CategoryManagePage";
import SubCategoryManagePage from "../SubCategoryManagePage";
import UserInfoPage from "../UserInfoPage";

export default function AdminManagement() {
   const [currentKey, setCurrentKey] = useState("1");
   const [breadcrumb, setBreadcrumb] = useState(["Quản lý danh mục"]);
   const [currentCategory, setCurrentCategory] = useState(null);

   const onDetailCategory = (key, category) => {
      setCurrentKey(key);
      setBreadcrumb(["Quản lý danh mục", category.name]);
      setCurrentCategory(category.id);
   };

   const renderComponent = () => {
      switch (currentKey) {
         case "1":
            return <CategoryManagePage viewDetail={onDetailCategory} />;
         case "1.1":
            return <SubCategoryManagePage categoryId={currentCategory} />;
         case "2":
            return <EvaluatePage />;
         case "4":
            return <UserInfoPage isNew />;
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
               <Text.caption title="Quản trị viên" />
            </Breadcrumb.Item>
            {breadcrumb.map((item) => (
               <Breadcrumb.Item>
                  <Text.caption title={item} />
               </Breadcrumb.Item>
            ))}
         </Breadcrumb>
         <div className={styles.content}>
            <SideMenuAdmin
               handleClick={setCurrentKey}
               currentKey={currentKey}
               updateBreadcrumb={setBreadcrumb}
            ></SideMenuAdmin>
            {renderComponent()}
         </div>
      </div>
   );
}
