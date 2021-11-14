import React, { useState } from "react";
import styles from "./styles.module.css";
import Text from "../Text";
import { Modal, Form, Input, message } from "antd";
import { del, update } from "../../services/categoryApi";
import { getByCategory } from "../../services/productApi";

export default function ManageCategoryItem(props) {
   const { category, callBackUpdate, viewDetail } = props;
   const [formRename] = Form.useForm();
   const [isModalDel, setIsModalDel] = useState(false);
   const [isModalRename, setIsModalRename] = useState(false);

   const onOkDel = async () => {
      const products = await getByCategory(category.id);
      if (products.length > 0) {
         message.error("Xóa danh mục thất bại! Danh mục đã có sản phẩm", 10);
      } else {
         del(category.id)
            .then(() => {
               callBackUpdate(true);
               message.success("Xóa danh mục thành công", 10);
            })
            .catch(() => {
               message.success("Xóa danh mục thất bại!", 10);
            });
      }
      setIsModalDel(false);
   };

   const onOkRename = () => {
      formRename.submit();
   };

   const onViewDetail = () => {
      viewDetail("1.1", category);
   };

   const onFinishRename = (values) => {
      update(category.id, values)
         .then(() => {
            message.success("Đổi tên danh mục thành công", 10);
            callBackUpdate();
         })
         .catch(() => {
            message.success("Đổi tên danh mục thất bại!", 10);
         });
      setIsModalRename(false);
   };

   return (
      <li key={category.id} className={styles.item}>
         <div className={styles.itemLeft}>
            <Text.bodyHighlight title={category.name} />
            <div style={{ marginTop: "5px" }}>
               <Text.caption
                  title={`${category.subCategory?.length || 0} danh mục con`}
                  color="gray"
               />
            </div>
         </div>
         <div className={styles.itemRight}>
            <button className={styles.actions} onClick={() => onViewDetail()}>
               <Text.underline title="Xem chi tiết" color="primary" />
            </button>
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
