import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { login as reduxLogin } from "../../redux/actions/userActions";
import { updateInfo, updatePassword } from "../../services/userApi";
import { add as addLicensing, getByBidder } from "../../services/licenceApi";
import { Divider, Form, Input, DatePicker, Modal, message, Button } from "antd";

export default function InfoAccountPage(props) {
   const [formInfo] = Form.useForm();
   const [formPassword] = Form.useForm();
   const { user } = useSelector((state) => state.user?.user);
   const { jwt } = useSelector((state) => state.user?.user);
   const dateFormat = "DD/MM/YYYY";
   const dispatch = useDispatch();
   const [isModalInfo, setIsModalInfo] = useState(false);
   const [isModalPassword, setIsModalPassword] = useState(false);
   const [isModalLicence, setIsModalLicence] = useState(false);
   const [isWaitingLicence, setIsWaitingLicence] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         const licence = await getByBidder(user.id);
         if (licence) setIsWaitingLicence(true);
      };
      fetchData();
      formInfo.setFieldsValue({
         email: user?.email,
         fullName: user?.fullName || user?.username,
         dateOfBirth: moment(user?.dateOfBirth),
      });
   }, [user, formInfo]);

   const onOkPassword = () => {
      setIsModalPassword(false);
      formPassword.submit();
   };

   const onOkInfo = () => {
      setIsModalInfo(false);
      formInfo.submit();
   };

   const onOkLicensing = () => {
      addLicensing({
         bidderId: user.id,
         time: moment(),
         status: "waiting",
      }).then(() => {
         setIsModalLicence(false);
         message.success(
            "Xin phép bán hàng thành công chờ người quản lý duyệt.",
            10
         );
      });
   };

   const onFinishInfo = (values) => {
      updateInfo(user?.id, values).then((userUpdate) => {
         localStorage.setItem(
            "user",
            JSON.stringify({
               jwt: jwt,
               user: userUpdate,
            })
         );
         dispatch(reduxLogin(userUpdate));
         message.success("Cập nhật thông tin thành công", 10);
      });
   };

   const onFinishPassword = async (values) => {
      updatePassword(user.id, values)
         .then((newUser) => {
            console.log(newUser);
            formPassword.resetFields();
            message.success("Cập nhật mật khẩu thành công", 10);
         })
         .catch((error) => {
            if (error.data.message[0].messages[0].field) {
               formPassword.setFields([
                  {
                     name: "oldPassword",
                     errors: ["Mật khẩu hiện tại không chính xác!"],
                  },
               ]);
            }
         });
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
               form={formInfo}
               name="info"
               onFinish={onFinishInfo}
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
                        { required: true, message: "Email không được trống!" },
                     ]}
                  >
                     <Input
                        placeholder="Nhập email"
                        disabled
                        style={{ color: "#333" }}
                     />
                  </Form.Item>
               </div>
               <div>
                  <div style={{ marginBottom: "8px" }}>
                     <label htmlFor="fullName" className={styles.inputLabel}>
                        <Text.caption title="Tên" />
                     </label>
                  </div>
                  <Form.Item
                     name="fullName"
                     rules={[
                        { required: true, message: "Tên không được trống!" },
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

               <Button
                  className={styles.btn}
                  type="button"
                  onClick={() => setIsModalInfo(true)}
               >
                  <Text.bodyHighlight title="Cập nhật thông tin" />
               </Button>
            </Form>
         </div>
         <Divider style={{ margin: "40px 0" }} />{" "}
         <Form
            form={formPassword}
            name="password"
            onFinish={onFinishPassword}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
         >
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
            <div>
               <div style={{ marginBottom: "8px" }}>
                  <label
                     htmlFor="confirmPassword"
                     className={styles.inputLabel}
                  >
                     <Text.caption title="Nhập lại mật khẩu" />
                  </label>
               </div>
               <Form.Item
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  hasFeedback
                  rules={[
                     {
                        required: true,
                        message: "Mật khẩu xác nhận trống!",
                     },
                     ({ getFieldValue }) => ({
                        validator(_, value) {
                           if (
                              !value ||
                              getFieldValue("newPassword") === value
                           ) {
                              return Promise.resolve();
                           }
                           return Promise.reject(
                              new Error("Mật khẩu xác nhận không trùng khớp!")
                           );
                        },
                     }),
                  ]}
               >
                  <Input.Password placeholder="Nhập mật khẩu mới" />
               </Form.Item>
            </div>
            <Button
               className={styles.btn}
               type="button"
               onClick={() => setIsModalPassword(true)}
            >
               <Text.bodyHighlight title="Cập nhật mật khẩu" />
            </Button>
         </Form>
         <Divider style={{ margin: "40px 0" }} />
         <div>
            <Text.h3 title="Trở thành người bán hàng" />
            <div className={styles.note}>
               {isWaitingLicence ? (
                  <Text.caption title="Bạn đang chờ quản trị viên phê duyệt để có thể đăng bán sản phẩm." />
               ) : (
                  <Text.caption title="Bạn cần được quản trị viên phê duyệt để có thể đăng bán sản phẩm." />
               )}
            </div>
            <Button
               className={styles.btn}
               type="button"
               onClick={() => setIsModalLicence(true)}
               disabled={isWaitingLicence}
            >
               <Text.bodyHighlight title="Xin phép bán hàng" />
            </Button>
         </div>
         <Modal
            title={<Text.bodyHighlight title="Xác nhận cập nhật thông tin" />}
            visible={isModalInfo}
            onOk={() => onOkInfo()}
            onCancel={() => setIsModalInfo(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Text.caption title={`Bạn có muốn cập nhật thông tin tài khoản?`} />
         </Modal>
         <Modal
            title={<Text.bodyHighlight title="Xác nhận cập nhật mật khẩu" />}
            visible={isModalPassword}
            onOk={() => onOkPassword()}
            onCancel={() => setIsModalPassword(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Text.caption title={`Bạn có muốn cập nhật mật khẩu?`} />
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
