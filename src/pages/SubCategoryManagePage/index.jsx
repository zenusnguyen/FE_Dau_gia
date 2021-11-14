import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import { Input, Button, Form, Modal, message } from "antd";
import LoadingPage from "../LoadingPage";
import { get, update } from "../../services/categoryApi";
import ManageSubCategoryItem from "../../components/ManageSubCategoryItem";
import { v4 as uuidv4 } from "uuid";

export default function SubCategoryManagePage(props) {
   const { categoryId } = props;
   const { Search } = Input;
   const [formAdd] = Form.useForm();
   const [isLoading, setIsLoading] = useState(true);
   const [category, setCategory] = useState([]);
   const [isModalAdd, setIsModalAdd] = useState(false);

   const fetchData = async (load) => {
      if (load) {
         setIsLoading(true);
      }
      const category = await get(categoryId);
      setCategory(category);
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
      const newSub = {
         id: uuidv4(),
         name: values.name,
      };
      let subCategory = null;
      if (category.subCategory === undefined) {
         subCategory = [];
      } else {
         subCategory = [...category.subCategory];
      }
      subCategory.push(newSub);
      update(category.id, { subCategory: subCategory })
         .then(() => {
            fetchData(true);
            message.success("Thêm danh mục con thành công", 10);
            formAdd.setFieldsValue({ name: "" });
         })
         .catch(() => {
            message.success("Thêm danh mục con thất bại!", 10);
         });
      setIsModalAdd(false);
   };

   useEffect(() => {
      fetchData();
   }, [categoryId]);

   return (
      <div className={styles.SubCategoryManagePage}>
         <div className={styles.top}>
            <Text.h3 title={`${isLoading ? "..." : category.name}`} />
            <div className={styles.topRight}>
               <Button
                  type="primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => setIsModalAdd(true)}
               >
                  <Text.caption title="Thêm danh mục con" />
               </Button>
            </div>
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <ul className={styles.list}>
               {category.subCategory?.map((subCategory) => (
                  <ManageSubCategoryItem
                     category={category}
                     subCategory={subCategory}
                     callBackUpdate={fetchData}
                  />
               ))}
            </ul>
         )}
         <Modal
            title={<Text.bodyHighlight title="Thêm danh mục con" />}
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
                        message: "Tên danh mục con không được trống!",
                     },
                  ]}
                  style={{ marginBottom: "0px" }}
               >
                  <Input placeholder="Nhập tên danh mục con" />
               </Form.Item>
            </Form>
         </Modal>
      </div>
   );
}
