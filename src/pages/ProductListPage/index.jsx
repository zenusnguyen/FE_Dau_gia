import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Pagination, Breadcrumb } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { Menu } from "antd";
import ProductList from "../../components/ProductList";
import Text from "../../components/Text";
import LoadingPage from "../LoadingPage";
import { Empty } from "antd";
import { getAll as getAllCategory } from "../../services/categoryApi";
import { getBySubCategory, getCountBySub } from "../../services/productApi";

export default function ProductListPage() {
   const history = useHistory();
   const { categoryId, subId, pageNumber } = useParams();
   const { SubMenu } = Menu;
   const [categoryOptions, setCategoryOptions] = useState([]);
   const [breadcrumb, setBreadcrumb] = useState([]);
   const [items, setItems] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [toTalPage, setToTalPage] = useState(1);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         Promise.all([
            getBySubCategory(subId, pageNumber),
            getAllCategory(),
            getCountBySub(subId),
         ]).then((values) => {
            const currentCategory = values[1].find(
               (category) => category.id === categoryId
            );
            const currentSub = currentCategory.subCategory.find(
               (sub) => sub.id === subId
            );
            setBreadcrumb([currentCategory.name, currentSub.name]);
            setCategoryOptions(values[1]);
            setItems(values[0]);
            setToTalPage(values[2]);
            setIsLoading(false);
         });
      };
      fetchData();
   }, [subId, categoryId, currentPage, pageNumber]);

   const handleMenuClick = (e) => {
      history.push(
         `/category/${e.keyPath[1]}/sub/${e.keyPath[0]}/page/${currentPage}`
      );
   };

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      history.push(`/category/${categoryId}/sub/${subId}/page/${pageNumber}`);
   };

   return (
      <div className={styles.searchPage}>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div className={styles.searchPageContainer}>
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
               <div className={styles.center}>
                  <Menu
                     onClick={handleMenuClick}
                     style={{ width: 255, marginRight: "25px" }}
                     mode="inline"
                     defaultSelectedKeys={[subId]}
                     defaultOpenKeys={[categoryId]}
                  >
                     {categoryOptions.map((category) => {
                        return (
                           <SubMenu
                              key={category.id}
                              title={<Text.body title={category.name} />}
                           >
                              {category.subCategory.map((sub) => {
                                 return (
                                    <Menu.Item key={sub.id}>
                                       <Text.caption title={sub.name} />
                                    </Menu.Item>
                                 );
                              })}
                           </SubMenu>
                        );
                     })}
                  </Menu>{" "}
                  {items.length > 0 ? (
                     <div className={styles.content}>
                        <ProductList products={items} />
                        <div className={styles.contentBottom}>
                           <Pagination
                              defaultCurrent={currentPage}
                              total={toTalPage}
                              pageSize={2}
                              onChange={handlePageChange}
                           />
                        </div>
                     </div>
                  ) : (
                     <div
                        className={styles.content}
                        style={{ width: "100%", position: "relative" }}
                     >
                        <Empty
                           style={{
                              top: "50%",
                              position: "absolute",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                           }}
                        />
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
