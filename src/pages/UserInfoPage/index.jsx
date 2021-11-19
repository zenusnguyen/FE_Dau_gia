import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import moment from "moment";
import { login as reduxLogin } from "../../redux/actions/userActions";
import {
  getById,
  updateInfo,
  updatePassword,
  add as addUser,
} from "../../services/userApi";
import { add as addLicensing, getByBidder } from "../../services/licenceApi";
import {
  Divider,
  Form,
  Input,
  DatePicker,
  Modal,
  message,
  Button,
  Switch,
} from "antd";
import LoadingPage from "../LoadingPage";

export default function UserInfoPage(props) {
  const { isNew, userId } = props;
  const [formInfo] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";
  const [isSeller, setIsSeller] = useState(true);
  const [isModalInfo, setIsModalInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    formInfo.resetFields();
    const fetchData = async () => {
      if (!isNew) {
        const user = await getById(userId);
        formInfo.setFieldsValue({
          email: user?.email,
          username: user?.username,
          dateOfBirth: moment(user?.dateOfBirth),
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [isNew, userId, formInfo]);

  const onOkInfo = () => {
    const currentInfo = formInfo.getFieldsValue();
    if (isNew) {
      //Handle add user
    } else {
      if (!currentInfo.password) delete currentInfo.password; //Handle update user
    }
    setIsModalInfo(false);
  };

  const onFinish = () => {
    setIsModalInfo(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.UserInfoPage}>
      <div>
        <Text.h3 title={isNew ? "Thêm người dùng" : "Chỉnh sữa thông tin"} />
      </div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
          <div className={styles.form}>
            <Form
              form={formInfo}
              name="info"
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
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập email"
                    disabled={!isNew}
                    style={{ color: "#333" }}
                  />
                </Form.Item>
              </div>
              <div>
                <div style={{ marginBottom: "8px" }}>
                  <label htmlFor="username" className={styles.inputLabel}>
                    <Text.caption title="Tên" />
                  </label>
                </div>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Tên không được trống!",
                    },
                  ]}
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
                  name="dateOfBirth"
                  rules={[
                    {
                      required: isNew,
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
                  <label htmlFor="password" className={styles.inputLabel}>
                    <Text.caption title="Mật khẩu" />
                  </label>
                </div>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: isNew,
                      message: "Mật khẩu trống!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </div>
              <div className={styles.toggle}>
                <Text.caption title="Tài khoản bán hàng" />
                <Switch
                  defaultChecked={isSeller}
                  onClick={() => setIsSeller(!isSeller)}
                />
              </div>
              <Button className={styles.btn} type="primary" htmlType="submit">
                <Text.bodyHighlight title={isNew ? "Thêm" : "Cập nhật"} />
              </Button>
            </Form>
          </div>
        </div>
      )}
      <Modal
        title={
          <Text.bodyHighlight
            title={
              isNew ? "Xác nhận thêm người dùng" : "Xác nhận cập nhật thông tin"
            }
          />
        }
        visible={isModalInfo}
        onOk={() => onOkInfo()}
        onCancel={() => setIsModalInfo(false)}
        okText={<Text.caption title="Đồng ý" />}
        cancelText={<Text.caption title="Hủy" />}
      >
        <Text.caption
          title={
            isNew
              ? "Bạn có muốn thêm người dùng?"
              : "Bạn có muốn cập nhật thông tin người dùng?"
          }
        />
      </Modal>
    </div>
  );
}
