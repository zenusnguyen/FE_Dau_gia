import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { login as reduxLogin } from "../../redux/actions/userActions";
import { updateInfo, updatePassword } from "../../services/userApi";
import { add as addLicensing, getByBidder } from "../../services/licenceApi";
import { Divider, Form, Input, DatePicker, Modal, message, Button } from "antd";
import LoadingPage from "../LoadingPage";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const licence = await getByBidder(user.id);
      console.log("licence: ", licence);
      if (licence?.length > 0) {
        setIsWaitingLicence(true);
      }
      formInfo.setFieldsValue({
        email: user?.email,
        username: user?.username || user?.username,
        dateOfBirth: moment(user?.dateOfBirth),
      });
      setIsLoading(false);
    };
    fetchData();
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
      userName: user.username,
      email: user.email,
    }).then(() => {
      setIsModalLicence(false);
      setIsWaitingLicence(true);
      message.success(
        "Xin ph??p b??n h??ng th??nh c??ng ch??? ng?????i qu???n l?? duy???t.",
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
      message.success("C???p nh???t th??ng tin th??nh c??ng", 10);
    });
  };

  const onFinishPassword = async (values) => {
    updatePassword(user.id, values)
      .then((newUser) => {
        console.log(newUser);
        formPassword.resetFields();
        message.success("C???p nh???t m???t kh???u th??nh c??ng", 10);
      })
      .catch((error) => {
        if (error.data.message[0].messages[0].field) {
          formPassword.setFields([
            {
              name: "oldPassword",
              errors: ["M???t kh???u hi???n t???i kh??ng ch??nh x??c!"],
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
        <Text.h3 title="Th??ng tin t??i kho???n" />
      </div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
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
                    {
                      required: true,
                      message: "Email kh??ng ???????c tr???ng!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nh???p email"
                    disabled
                    style={{ color: "#333" }}
                  />
                </Form.Item>
              </div>
              <div>
                <div style={{ marginBottom: "8px" }}>
                  <label htmlFor="userame" className={styles.inputLabel}>
                    <Text.caption title="T??n" />
                  </label>
                </div>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "T??n kh??ng ???????c tr???ng!",
                    },
                  ]}
                >
                  <Input placeholder="Nh???p t??n" />
                </Form.Item>
              </div>
              <div>
                <div style={{ marginBottom: "8px" }}>
                  <label className={styles.inputLabel}>
                    <Text.caption title="Ng??y sinh" />
                  </label>
                </div>
                <Form.Item
                  name="dateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: "Ng??y sinh kh??ng ???????c tr???ng!",
                    },
                  ]}
                >
                  <DatePicker
                    format={dateFormat}
                    style={{ width: "100%" }}
                    placeholder="Ch???n ng??y sinh"
                  />
                </Form.Item>
              </div>

              <Button
                className={styles.btn}
                type="button"
                onClick={() => setIsModalInfo(true)}
              >
                <Text.bodyHighlight title="C???p nh???t th??ng tin" />
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
                  <Text.caption title="M???t kh???u c??" />
                </label>
              </div>
              <Form.Item
                name="oldPassword"
                rules={[{ required: true, message: "M???t kh???u c??? tr???ng!" }]}
              >
                <Input.Password placeholder="Nh???p m???t kh???u c??" />
              </Form.Item>
            </div>
            <div>
              <div style={{ marginBottom: "8px" }}>
                <label htmlFor="newPassword" className={styles.inputLabel}>
                  <Text.caption title="M???t kh???u m???i" />
                </label>
              </div>
              <Form.Item
                name="newPassword"
                rules={[{ required: true, message: "M???t kh???u m???i tr???ng!" }]}
              >
                <Input.Password placeholder="Nh???p m???t kh???u m???i" />
              </Form.Item>
            </div>
            <div>
              <div style={{ marginBottom: "8px" }}>
                <label htmlFor="confirmPassword" className={styles.inputLabel}>
                  <Text.caption title="Nh???p l???i m???t kh???u" />
                </label>
              </div>
              <Form.Item
                name="confirmPassword"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "M???t kh???u x??c nh???n tr???ng!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("M???t kh???u x??c nh???n kh??ng tr??ng kh???p!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nh???p m???t kh???u m???i" />
              </Form.Item>
            </div>
            <Button
              className={styles.btn}
              type="button"
              onClick={() => setIsModalPassword(true)}
            >
              <Text.bodyHighlight title="C???p nh???t m???t kh???u" />
            </Button>
          </Form>
          <Divider style={{ margin: "40px 0" }} />
          <div>
            <Text.h3 title="Tr??? th??nh ng?????i b??n h??ng" />
            <div className={styles.note}>
              {isWaitingLicence ? (
                <Text.caption title="B???n ??ang ch??? qu???n tr??? vi??n ph?? duy???t ????? c?? th??? ????ng b??n s???n ph???m." />
              ) : (
                <Text.caption title="B???n c???n ???????c qu???n tr??? vi??n ph?? duy???t ????? c?? th??? ????ng b??n s???n ph???m." />
              )}
            </div>
            <Button
              className={styles.btn}
              type="button"
              onClick={() => setIsModalLicence(true)}
              disabled={isWaitingLicence}
            >
              <Text.bodyHighlight title="Xin ph??p b??n h??ng" />
            </Button>
          </div>
        </div>
      )}
      <Modal
        title={<Text.bodyHighlight title="X??c nh???n c???p nh???t th??ng tin" />}
        visible={isModalInfo}
        onOk={() => onOkInfo()}
        onCancel={() => setIsModalInfo(false)}
        okText={<Text.caption title="?????ng ??" />}
        cancelText={<Text.caption title="H???y" />}
      >
        <Text.caption title={`B???n c?? mu???n c???p nh???t th??ng tin t??i kho???n?`} />
      </Modal>
      <Modal
        title={<Text.bodyHighlight title="X??c nh???n c???p nh???t m???t kh???u" />}
        visible={isModalPassword}
        onOk={() => onOkPassword()}
        onCancel={() => setIsModalPassword(false)}
        okText={<Text.caption title="?????ng ??" />}
        cancelText={<Text.caption title="H???y" />}
      >
        <Text.caption title={`B???n c?? mu???n c???p nh???t m???t kh???u?`} />
      </Modal>
      <Modal
        title={
          <Text.bodyHighlight title="X??c nh???n xin ???????c c???p ph??p b??n h??ng" />
        }
        visible={isModalLicence}
        onOk={() => onOkLicensing()}
        onCancel={() => setIsModalLicence(false)}
        okText={<Text.caption title="?????ng ??" />}
        cancelText={<Text.caption title="H???y" />}
      >
        <Text.caption title={`B???n c?? mu???n xin ph??p b??n h??ng?`} />
      </Modal>
    </div>
  );
}
