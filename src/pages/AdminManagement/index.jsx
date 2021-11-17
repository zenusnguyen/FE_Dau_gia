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
import UserManagePage from "../UserManagePage";
import ProductManagePage from "../ProductManagePage";
import ProductInfoPage from "../ProductInfoPage";

export default function AdminManagement() {
   const [currentKey, setCurrentKey] = useState("1");
   const [breadcrumb, setBreadcrumb] = useState(["Quản lý danh mục"]);
   const [currentCategory, setCurrentCategory] = useState(null);
   const [currentUser, setCurrentUser] = useState(null);
   const [currentProduct, setCurrentProduct] = useState(null);

   const onDetailCategory = (key, category) => {
      setCurrentKey(key);
      setBreadcrumb(["Quản lý danh mục", category.name]);
      setCurrentCategory(category.id);
   };

   const onDetailProduct = (key, productId) => {
      setCurrentKey(key);
      setBreadcrumb(["Quản lý sản phẩm", "Chỉnh sửa thông tin sản phẩm"]);
      setCurrentProduct(productId);
   };

   const onDetailUser = (key, userId) => {
      setCurrentKey(key);
      setBreadcrumb(["Quản lý người dùng", "Chỉnh sửa thông tin"]);
      setCurrentUser(userId);
   };

   const renderComponent = () => {
      switch (currentKey) {
         case "1":
            return <CategoryManagePage viewDetail={onDetailCategory} />;
         case "1.1":
            return <SubCategoryManagePage categoryId={currentCategory} />;
         case "2":
            return <ProductManagePage viewDetail={onDetailProduct} />;
         case "2.1":
            return <ProductInfoPage productId={currentProduct} />;
         case "4":
            return <UserInfoPage isNew />;
         case "5":
            return <UserManagePage viewDetail={onDetailUser} />;
         case "5.1":
            return <UserInfoPage userId={currentUser} />;
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
