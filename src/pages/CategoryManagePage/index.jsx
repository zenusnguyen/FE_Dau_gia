import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import { Input, Button, Form, Modal, message } from "antd";
import LoadingPage from "../LoadingPage";
import { getAll, add, search } from "../../services/categoryApi";
import ManageCategoryItem from "../../components/ManageCategoryItem";

export default function CategoryManagePage(props) {
   const { viewDetail } = props;
   const { Search } = Input;
   const [formAdd] = Form.useForm();
   const [isLoading, setIsLoading] = useState(true);
   const [categories, setCategories] = useState([]);
   const [isModalAdd, setIsModalAdd] = useState(false);

   const fetchData = async (load) => {
      if (load) {
         setIsLoading(true);
      }
      const allCategory = await getAll();
      setCategories(allCategory);
      setIsLoading(false);
   };

   const onOkAdd = () => {
      formAdd.submit();
   };

   const onCancelAdd = () => {
      formAdd.setFieldsValue({ name: "" });
      setIsModalAdd(false);
   };

   const onFinishAdd = (values) => {
      add(values)
         .then(() => {
            setIsLoading(true);
            fetchData();
            message.success("Thêm danh mục thành công", 10);
            formAdd.setFieldsValue({ name: "" });
         })
         .catch(() => {
            message.success("Thêm danh mục thất bại!", 10);
         });
      setIsModalAdd(false);
   };

   const onSearch = async (value) => {
      setIsLoading(true);
      const allCategory = await search(value);
      setCategories(allCategory);
      setIsLoading(false);
   };

   useEffect(() => {
      fetchData();
   }, []);

   return (
      <div className={styles.CategoryManagePage}>
         <div className={styles.top}>
            <Text.h3
               title={`Quản lý danh mục (${
                  isLoading ? "..." : categories.length
               })`}
            />
            <div className={styles.topRight}>
               <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => setIsModalAdd(true)}
               >
                  <Text.caption title="Thêm danh mục" />
               </Button>
               <Search
                  placeholder="Tìm kiếm danh mục"
                  onSearch={onSearch}
                  style={{ width: 264 }}
               />
            </div>
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <ul className={styles.list}>
               {categories.map((category) => (
                  <ManageCategoryItem
                     category={category}
                     callBackUpdate={fetchData}
                     viewDetail={viewDetail}
                  />
               ))}
            </ul>
         )}
         <Modal
            title={<Text.bodyHighlight title="Thêm danh mục" />}
            visible={isModalAdd}
            onOk={() => onOkAdd()}
            onCancel={() => onCancelAdd()}
            okText={<Text.caption title="Thêm" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Form
               form={formAdd}
               layout="vertical"
               onFinish={onFinishAdd}
               //onFinishFailed={onFinishFailed}
               autoComplete="off"
            >
               <Form.Item
                  name="name"
                  rules={[
                     {
                        required: true,
                        message: "Tên danh mục không được trống!",
                     },
                  ]}
                  style={{ marginBottom: "0px" }}
               >
                  <Input placeholder="Nhập tên danh mục" />
               </Form.Item>
            </Form>
         </Modal>
      </div>
   );
}
