import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

import { Divider, Form, Input, DatePicker } from "antd";

export default function InfoAccountPage(props) {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.user);
  console.log("user: ", user);

  const dateFormat = "DD/MM/YYYY";

  const data = {
    email: "zenus@gmail.com",
    name: "Nguyễn Việt Anh",
    birthDay: "01-01-1998",
  };

  useEffect(() => {
    form.setFieldsValue({
      email: user?.user?.email,
      name: user?.user?.fullName || user?.user?.username,
      birthDay: moment(data.birthDay),
    });
  }, []);

  const onFinish = (values) => {
    console.log("Success:", values);
    console.log(values.birthDay.format(dateFormat));
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
        >
          <div>
            <div style={{ marginBottom: "8px" }}>
              <label>
                <Text.caption title="Email" />
              </label>
            </div>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Email không được trống!" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <label htmlFor="name" className={styles.inputLabel}>
                <Text.caption title="Tên" />
              </label>
            </div>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Tên không được trống!" }]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <label className={styles.inputLabel}>
                <Text.caption title="Ngày sinh" />
              </label>
            </div>
            <Form.Item
              name="birthDay"
              rules={[
                {
                  required: true,
                  message: "Ngày sinh không được trống!",
                },
              ]}
            >
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <label htmlFor="oldPassword" className={styles.inputLabel}>
                <Text.caption title="Mật khẩu cũ" />
              </label>
            </div>
            <Form.Item
              name="oldPassword"
              rules={[{ required: true, message: "Mật khẩu củ trống!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu cũ" />
            </Form.Item>
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <label htmlFor="newPassword" className={styles.inputLabel}>
                <Text.caption title="Mật khẩu mới" />
              </label>
            </div>
            <Form.Item
              name="newPassword"
              rules={[{ required: true, message: "Mật khẩu mới trống!" }]}
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
