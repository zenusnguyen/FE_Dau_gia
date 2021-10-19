import React from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import { Divider, Form, Input, DatePicker } from "antd";

export default function AddProductPage(props) {
   const onFinish = (values) => {
      console.log("Success:", values);
   };

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   const dateFormat = "DD/MM/YYYY";

   return (
      <div className={styles.addProductPage}>
         <div>
            <Text.h3 title="Thêm sản phẩm" />
         </div>
         <div className={styles.content}>
            <div className={styles.left}>
               <Form
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  initialValues={{
                     remember: true,
                  }}
               >
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label>
                           <Text.caption title="Tên sản phẩm" />
                        </label>
                     </div>
                     <Form.Item
                        name="name"
                        rules={[
                           {
                              required: true,
                              message: "Tên sản phẩm không được trống!",
                           },
                        ]}
                     >
                        <Input placeholder="Nhập tên sản phẩm" />
                     </Form.Item>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Giá khởi điểm" />
                        </label>
                        <Form.Item
                           name="price"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (!value) {
                                       return Promise.reject(
                                          "Giá khởi điểm không được trống."
                                       );
                                    }
                                    if (value < 0) {
                                       return Promise.reject(
                                          "Giá khởi điểm không hợp lệ."
                                       );
                                    }
                                    if (!parseInt(value)) {
                                       return Promise.reject(
                                          "Giá khởi điểm không hợp lệ."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <Input
                              placeholder="Nhập giá khởi điểm"
                              type="number"
                           />
                        </Form.Item>
                     </div>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Bước giá" />
                        </label>
                        <Form.Item
                           name="priceStep"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (!value) {
                                       return Promise.reject(
                                          "Bước giá không được trống."
                                       );
                                    }
                                    if (value < 0) {
                                       return Promise.reject(
                                          "Bước giá không hợp lệ."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <Input placeholder="Nhập bước giá " type="number" />
                        </Form.Item>
                     </div>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Thời hạn" />
                        </label>
                        <Form.Item
                           name="endTime"
                           rules={[
                              {
                                 required: true,
                                 message: "Thời hạn không được trống!",
                              },
                           ]}
                        >
                           <DatePicker
                              format={dateFormat}
                              style={{ width: "100%" }}
                              placeholder="Chọn ngày giời"
                           />
                        </Form.Item>
                     </div>
                  </div>
                  <div>
                     <div style={{ marginBottom: "8px" }}>
                        <label className={styles.inputLabel}>
                           <Text.caption title="Giá mua ngay (không bắt buộc)" />
                        </label>
                        <Form.Item
                           name="priceBuy"
                           rules={[
                              () => ({
                                 validator(_, value) {
                                    if (value < 0) {
                                       return Promise.reject(
                                          "Giá mua ngay không hợp lệ."
                                       );
                                    }
                                    return Promise.resolve();
                                 },
                              }),
                           ]}
                        >
                           <Input
                              placeholder="Nhập giá mua ngay "
                              type="number"
                           />
                        </Form.Item>
                     </div>
                  </div>
               </Form>
            </div>
         </div>
      </div>
   );
}
