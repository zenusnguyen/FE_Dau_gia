import React, { useEffect } from "react";
import { Button, Input, Form, message, Card, Image } from "antd";
import styles from "./styles.module.css";
import { register } from "../../services/register";
import LoginImage from "../../assets/Hero.png";
import Brand from "../../assets/Brand.png";
// import { loadReCaptcha, ReCaptcha } from "react-recaptcha-google";
import ReCAPTCHA from "react-grecaptcha";

export default function RegisterPage() {
  // useEffect(() => {
  //   loadReCaptcha();
  // }, []);

  const onFinish = async (values) => {
    const res = await register(values);
    console.log("res: ", res);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleRecapchaCallback = (e) => {
    console.log("e: ", e);
  };

  const handleExpiredCallback = (e) => {
    console.log("e: ", e);
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
            Bạn đã có tài khoản ? <a href="/login"> Đăng nhập</a>
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
            <div className={styles.otpWrapper}>
              <Input />
              <Button className={styles.otpBtn}>Gửi mã</Button>
            </div>
          </Form.Item>

          <ReCAPTCHA
            sitekey="6LeTci8UAAAAAAZV-D4OGD9x7VJvBUQ8QJDT9N4X"
            callback={handleRecapchaCallback}
            expiredCallback={handleExpiredCallback}
            locale="en"
          />
          <Form.Item>
            <Button className={styles.btnSubmit} htmlType="submit">
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
