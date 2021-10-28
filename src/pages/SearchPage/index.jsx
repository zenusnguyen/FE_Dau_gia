import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useParams, useHistory } from "react-router-dom";
import { Button, Pagination, Breadcrumb } from "antd";
import ProductList from "../../components/ProductList";
import Text from "../../components/Text";
import { getCountSearch, search } from "../../services/productApi";
export default function SearchPage() {
   const history = useHistory();
   const { searchWord, pageNumber } = useParams();
   const [breadcrumb, setBreadcrumb] = useState([]);
   const [items, setItems] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [toTalPage, setToTalPage] = useState(1);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setBreadcrumb(["Tiềm kiếm", searchWord]);
         //HandleApi
      };
      fetchData();
   }, [searchWord, currentPage, pageNumber]);

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      history.push(`/search/${searchWord}/page/${pageNumber}`);
   };

   return (
      <div className={styles.searchPage}>
         <div className={styles.searchPageContainer}>
            <div className={styles.content}>
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
               <div className={styles.contentTop}>
                  <div className={styles.filter}>
                     <Button
                        style={{
                           borderTopRightRadius: "0",
                           borderBottomRightRadius: "0",
                        }}
                     >
                        <Text.caption title="Thời gian kết thúc giảm dần" />
                     </Button>
                     <Button
                        style={{
                           borderTopLeftRadius: "0",
                           borderBottomLeftRadius: "0",
                        }}
                     >
                        <Text.caption title="Giá tăng dần" />
                     </Button>
                  </div>
                  <Pagination
                     defaultCurrent={currentPage}
                     total={toTalPage}
                     pageSize={2}
                  />
               </div>
               <ProductList products={items} />
               <div className={styles.contentBottom}>
                  <Pagination
                     defaultCurrent={currentPage}
                     total={toTalPage}
                     pageSize={2}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}
