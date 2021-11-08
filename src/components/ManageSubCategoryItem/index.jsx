import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Text from "../Text";
import { Modal, Form, Input, message } from "antd";
import { del, update } from "../../services/categoryApi";
import { getCountBySub } from "../../services/productApi";

export default function ManageSubCategoryItem(props) {
   const { category, subCategory, callBackUpdate } = props;
   const [formRename] = Form.useForm();
   const [isModalDel, setIsModalDel] = useState(false);
   const [isModalRename, setIsModalRename] = useState(false);
   const [countProduct, setCountProduct] = useState(0);

   useEffect(() => {
      const fetchData = async () => {
         const countProduct = await getCountBySub(subCategory.id);
         setCountProduct(countProduct);
      };
      fetchData();
   }, [subCategory]);

   const onOkDel = async () => {
      const productCount = await getCountBySub(subCategory.id);
      if (productCount > 0) {
         message.error("Xóa danh mục thất bại! Danh mục đã có sản phẩm", 10);
      } else {
         const index = category.subCategory.indexOf(subCategory);
         const newSubCategory = [...category.subCategory];
         newSubCategory.splice(index, 1);
         update(category.id, { subCategory: newSubCategory })
            .then(() => {
               callBackUpdate(true);
               message.success("Xóa danh mục con thành công", 10);
            })
            .catch(() => {
               message.success("Xóa danh mụccon thất bại!", 10);
            });
      }
      setIsModalDel(false);
   };

   const onOkRename = () => {
      formRename.submit();
   };

   const onFinishRename = (values) => {
      const index = category.subCategory.indexOf(subCategory);
      const newSubCategory = [...category.subCategory];
      newSubCategory[index].name = values.name;
      update(category.id, { subCategory: newSubCategory })
         .then(() => {
            callBackUpdate();
            message.success("Đổi tên danh mục con thành công", 10);
         })
         .catch(() => {
            message.success("Đổi tên danh mục con thất bại!", 10);
         });
      setIsModalRename(false);
   };

   return (
      <li key={subCategory.id} className={styles.item}>
         <div className={styles.itemLeft}>
            <Text.bodyHighlight title={subCategory.name} />
            <div style={{ marginTop: "5px" }}>
               <Text.caption
                  title={`${countProduct || 0} sản phẩm`}
                  color="gray"
               />
            </div>
         </div>
         <div className={styles.itemRight}>
            <button
               className={styles.actions}
               onClick={() => setIsModalRename(true)}
            >
               <Text.underline title="Đổi tên" color="primary" />
            </button>
            <button
               className={styles.actions}
               onClick={() => setIsModalDel(true)}
            >
               <Text.underline title="Xóa" color="gray" />
            </button>
         </div>
         <Modal
            title={<Text.bodyHighlight title="Đổi tên" />}
            visible={isModalRename}
            onOk={() => onOkRename()}
            onCancel={() => setIsModalRename(false)}
            okText={<Text.caption title="Đổi tên" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Form
               form={formRename}
               layout="vertical"
               onFinish={onFinishRename}
               //onFinishFailed={onFinishFailed}
               autoComplete="off"
            >
               <Form.Item
                  name="name"
                  rules={[
                     { required: true, message: "Tên mới không được trống!" },
                  ]}
                  style={{ marginBottom: "0px" }}
               >
                  <Input placeholder="Nhập tên mới" />
               </Form.Item>
            </Form>
         </Modal>
         <Modal
            title={<Text.bodyHighlight title="Xác nhận xóa" />}
            visible={isModalDel}
            onOk={() => onOkDel()}
            onCancel={() => setIsModalDel(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Text.caption
               title={`Danh mục này sẽ không thể khôi phục nếu bị xoá. Bạn có chắc muốn tiếp tục?`}
            />
         </Modal>
      </li>
   );
}
