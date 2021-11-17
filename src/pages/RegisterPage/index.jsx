import React, { useEffect } from "react";
import { Button, Input, Form, message, Card, Image } from "antd";
import styles from "./styles.module.css";
import { register } from "../../services/register";
import LoginImage from "../../assets/Hero.png";
import Brand from "../../assets/Brand.png";
// import { loadReCaptcha, ReCaptcha } from "react-recaptcha-google";
import ReCAPTCHA from "react-grecaptcha";
import { useHistory } from "react-router-dom";
import { getOtp } from "../../services/email";

export default function RegisterPage() {
  // useEffect(() => {
  //   loadReCaptcha();
  // }, []);
  const history = useHistory();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("values: ", values);
    try {
      const otp = localStorage.getItem("otp");
      console.log("otp: ", otp);
      if (otp != values?.otp) {
        message.error("ma OTP không đúng vui lòng kiểm tra lại");
      } else {
        const res = await register(values);
        if (res.jwt) {
          message.success("Đăng ký thành công");
          setTimeout(() => {
            history.push("/home");
          }, 1000);
        }
      }
    } catch (err) {
      message.warn(err.message);
    }
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

  const handleOtp = async () => {
    const formData = await form.getFieldValue();

    if (!formData?.email) {
      message.error("Vui lòng nhập email");
    } else {
    }
    await getOtp(formData?.email)
      .then(async (res) => {
        console.log("res: ", res);
        await localStorage.setItem("otp", JSON.stringify(res));
        message.success("Gửi mã thành công");
      })
      .catch((err) => {
        message.error("Gửi mã thất bại");
        console.log("err: ", err);
      });
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
          form={form}
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
              <Button
                onClick={() => {
                  handleOtp();
                }}
                className={styles.otpBtn}
              >
                Gửi mã
              </Button>
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
