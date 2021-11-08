import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import moment from "moment";
import { login as reduxLogin } from "../../redux/actions/userActions";
import {
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
   const dateFormat = "DD/MM/YYYY";
   const [user, setUser] = useState({});
   const [isSeller, setIsSeller] = useState(true);
   const [isModalInfo, setIsModalInfo] = useState(false);
   const [isModalPassword, setIsModalPassword] = useState(false);
   const [isModalLicence, setIsModalLicence] = useState(false);
   const [isWaitingLicence, setIsWaitingLicence] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         if (!isNew) {
            const user = await getByBidder(userId);
            setUser(user);
         }
         setIsLoading(false);
      };
      fetchData();
   }, [isNew, userId]);

   const onOkLicensing = () => {
      // addLicensing({
      //    bidderId: user.id,
      //    time: moment(),
      //    status: "waiting",
      // }).then(() => {
      //    setIsModalLicence(false);
      //    message.success(
      //       "Xin phép bán hàng thành công chờ người quản lý duyệt.",
      //       10
      //    );
      // });
   };

   const onFinish = (values) => {
      console.log(values);
      // updateInfo(user?.id, values).then((userUpdate) => {
      //    localStorage.setItem(
      //       "user",
      //       JSON.stringify({
      //          jwt: jwt,
      //          user: userUpdate,
      //       })
      //    );
      //    dispatch(reduxLogin(userUpdate));
      //    message.success("Cập nhật thông tin thành công", 10);
      // });
   };

   const onFinishPassword = async (values) => {
      // updatePassword(user.id, values)
      //    .then((newUser) => {
      //       console.log(newUser);
      //       formPassword.resetFields();
      //       message.success("Cập nhật mật khẩu thành công", 10);
      //    })
      //    .catch((error) => {
      //       if (error.data.message[0].messages[0].field) {
      //          formPassword.setFields([
      //             {
      //                name: "oldPassword",
      //                errors: ["Mật khẩu hiện tại không chính xác!"],
      //             },
      //          ]);
      //       }
      //    });
   };

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   return (
      <div className={styles.UserInfoPage}>
         <div>
            <Text.h3
               title={isNew ? "Thêm người dùng" : "Chỉnh sữa thông tin"}
            />
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               <div className={styles.form}>
                  <Form
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
                           <label
                              htmlFor="username"
                              className={styles.inputLabel}
                           >
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
                           <label
                              htmlFor="password"
                              className={styles.inputLabel}
                           >
                              <Text.caption title="Mật khẩu" />
                           </label>
                        </div>
                        <Form.Item
                           name="password"
                           rules={[
                              {
                                 required: true,
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
                     <Button
                        className={styles.btn}
                        type="primary"
                        htmlType="submit"
                     >
                        <Text.bodyHighlight title="Thêm" />
                     </Button>
                  </Form>
               </div>
            </div>
         )}
         <Modal
            title={<Text.bodyHighlight title="Xác nhận cập nhật thông tin" />}
            visible={isModalInfo}
            onOk={() => {}}
            onCancel={() => setIsModalInfo(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Text.caption title={`Bạn có muốn cập nhật thông tin tài khoản?`} />
         </Modal>
         <Modal
            title={
               <Text.bodyHighlight title="Xác nhận xin được cấp phép bán hàng" />
            }
            visible={isModalLicence}
            onOk={() => onOkLicensing()}
            onCancel={() => setIsModalLicence(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Text.caption title={`Bạn có muốn xin phép bán hàng?`} />
         </Modal>
      </div>
   );
}
