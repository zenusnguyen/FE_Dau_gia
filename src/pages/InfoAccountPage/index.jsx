import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import { Divider, Form, Input } from "antd";

export default function InfoAccountPage(props) {
   const [form] = Form.useForm();

   const data = {
      email: "zenus@gmail.com",
      name: "Nguyễn Việt Anh",
      birthDay: "1998-01-01",
   };

   useEffect(() => {
      form.setFieldsValue({
         email: data.email,
         name: data.name,
         birthDay: new Date(data.birthDay).toISOString().split("T")[0],
      });
   }, []);

   const onFinish = (values) => {
      console.log("Success:", values);
   };

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   return (
      <div className={styles.infoAccoutPage}>
         <div>
            <Text.h3 title="Thông tin tài khoản" />
         </div>
         <div className={styles.form}>
            <Form
               form={form}
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
                        <Text.caption title="Email" />
                     </label>
                  </div>
                  <Form.Item
                     name="email"
                     rules={[
                        { required: true, message: "Email không được trống!" },
                     ]}
                  >
                     <Input placeholder="Nhập email" />
                  </Form.Item>
               </div>
               <div>
                  <div style={{ marginBottom: "8px" }}>
                     <label htmlFor="name" className={styles.inputLabel}>
                        <Text.caption title="Tên" />
                     </label>{" "}
                     <Form.Item
                        name="name"
                        rules={[
                           { required: true, message: "Tên không được trống!" },
                        ]}
                     >
                        <Input placeholder="Nhập tên" />
                     </Form.Item>
                  </div>
               </div>
               <div>
                  <div style={{ marginBottom: "8px" }}>
                     <label htmlFor="birthDay" className={styles.inputLabel}>
                        <Text.caption title="Ngày sinh" />
                     </label>{" "}
                     <Form.Item
                        name="birthDay"
                        rules={[
                           { required: true, message: "Ngày sinh trống!" },
                        ]}
                     >
                        <Input placeholder="Ngày sinh" type="date" />
                     </Form.Item>
                  </div>
               </div>
               <div>
                  <div style={{ marginBottom: "8px" }}>
                     <label htmlFor="oldPassword" className={styles.inputLabel}>
                        <Text.caption title="Mật khẩu cũ" />
                     </label>{" "}
                     <Form.Item
                        name="oldPassword"
                        rules={[
                           { required: true, message: "Mật khẩu củ trống!" },
                        ]}
                     >
                        <Input.Password placeholder="Nhập mật khẩu cũ" />
                     </Form.Item>
                  </div>
               </div>
               <div>
                  <div style={{ marginBottom: "8px" }}>
                     <label htmlFor="newPassword" className={styles.inputLabel}>
                        <Text.caption title="Mật khẩu mới" />
                     </label>
                  </div>
                  <Form.Item
                     name="newPassword"
                     rules={[
                        { required: true, message: "Mật khẩu mới trống!" },
                     ]}
                  >
                     <Input.Password placeholder="Nhập mật khẩu mới" />
                  </Form.Item>
               </div>
               <button className={styles.btn}>
                  <Text.bodyHighlight title="Cập nhật" />
               </button>
            </Form>
         </div>
         <Divider style={{ margin: "40px 0" }} />
         <div>
            <Text.h3 title="Trở thành người bán hàng" />
            <div className={styles.note}>
               <Text.caption title="Bạn cần được quản trị viên phê duyệt để có thể đăng bán sản phẩm." />
            </div>
            <button className={styles.btn}>
               <Text.bodyHighlight title="Xin phép bán hàng" />
            </button>
         </div>
      </div>
   );
}
