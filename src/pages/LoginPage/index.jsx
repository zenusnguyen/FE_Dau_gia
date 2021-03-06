import React from "react";
import { Button, Input, Form, message, Card, Image } from "antd";
import styles from "./styles.module.css";
import { login } from "../../services/login";
import LoginImage from "../../assets/Hero.png";
import Brand from "../../assets/Brand.png";
import { useHistory } from "react-router-dom";
import { login as reduxLogin } from "../../redux/actions/userActions";
import { useSelector, useDispatch } from "react-redux";

export default function LoginPage() {
   const dispatch = useDispatch();
   const history = useHistory();
   const { user } = useSelector((state) => state.user);

   const onFinish = async (values) => {
      try {
         const res = await login(values);
         if (res.jwt) {
            dispatch(reduxLogin(res));
            history.push("/home");
         } else {
            /// show message err
            message.warn("Đăng nhập thất bại");
         }
      } catch (err) {
         console.log("err: ", err);
      }
   };
   const responseGoogle = (response) => {
      console.log(response);
   };

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   const formLayout = "vertical";
   const formItemLayout =
      formLayout === "horizontal"
         ? {
              labelCol: {
                 span: 4,
              },
              wrapperCol: {
                 span: 14,
              },
           }
         : null;
   const buttonItemLayout =
      formLayout === "horizontal"
         ? {
              wrapperCol: {
                 span: 14,
                 offset: 4,
              },
           }
         : null;
   return (
      <div className={styles.container}>
         <div className={styles.imageWrapper}>
            <Image preview={false} width={900} src={LoginImage}></Image>
         </div>
         <div className={styles.formWrapper}>
            <div className={styles.brandWrapper}>
               <Image preview={false} src={Brand}></Image>

               <div className={styles.haveAnAccText}>
                  Bạn là người mới ? <a href="/register"> Đăng ký</a>
               </div>
            </div>
            <h1>Đăng nhập</h1>
            <Form
               {...formItemLayout}
               layout={formLayout}
               name="basic"
               labelCol={{ span: 8 }}
               wrapperCol={{ span: 24 }}
               onFinish={onFinish}
               onFinishFailed={onFinishFailed}
               autoComplete="off"
            >
               <Form.Item
                  label="Email của bạn"
                  name="identifier"
                  rules={[{ required: true, message: "Hãy nhập email" }]}
               >
                  <Input />
               </Form.Item>

               <Form.Item
                  label="Mât khẩu"
                  name="password"
                  rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
               >
                  <Input.Password />
               </Form.Item>

               <Form.Item>
                  <Button className={styles.btnSubmit} htmlType="submit">
                     Đăng nhập
                  </Button>
               </Form.Item>
            </Form>
            <div>Hoặc</div>
            <div className={styles.socialWrapper}>
               <Button
                  style={{ backgroundColor: "#1877F2", color: "#fff" }}
                  onClick={() =>
                     (window.location =
                        "http://localhost:1337/connect/facebook")
                  }
               >
                  Tiếp tục với Facebook
               </Button>
               <Button
                  style={{ marginTop: "16px" }}
                  onClick={() =>
                     (window.location = "http://localhost:1337/connect/google")
                  }
               >
                  Tiếp tục với Google
               </Button>
            </div>
         </div>
      </div>
   );
}
