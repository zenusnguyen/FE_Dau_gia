import React from "react";
import { Button, Input, Form, message, Card, Image } from "antd";
import styles from "./index.css";
import { register } from "../../services/register";
import LoginImage from "../../assets/Hero.png";
import Brand from "../../assets/Brand.png";

export default function LoginPage() {
  const onFinish = async (values) => {
    const res = await register(values);
    console.log("res: ", res);
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
    <div className="container">
      <div className="imageWrapper">
        <Image preview={false} src={LoginImage}></Image>
      </div>
      <div className="formWrapper">
        <div className="brandWrapper">
          <Image preview={false} src={Brand}></Image>

          <div className="haveAnAccText">
            Bạn đã có tài khoản ? <a href="#"> Đăng nhập</a>
          </div>
        </div>
        <h1>Tạo tài khoản</h1>

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          {...formItemLayout}
          layout={formLayout}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên của bạn"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email của bạn"
            name="email"
            type="email"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                type: "email",
                message: "Please enter your email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please input your password!" },
              ({ getFieldValue }) => ({
                validator(__, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("Password do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mã xác thực"
            name="otp"
            rules={[{ required: true, message: "Please input your otp!" }]}
          >
            <div className="otpWrapper">
              <Input />
              <Button className="otpBtn">Gửi mã</Button>
            </div>
          </Form.Item>
          <Form.Item>
            <Button className="btnSubmit" htmlType="submit">
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
