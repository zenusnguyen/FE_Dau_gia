/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Text from "../Text";
import {
  Image,
  Button,
  Divider,
  Badge,
  Modal,
  Form,
  Input,
  Radio,
  message,
} from "antd";
import { EditOutlined, LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { BACKEND_DOMAIN } from "../../constants";
import moment from "moment";
import { getById as getUserById } from "../../services/userApi";
import { getAllHistory } from "../../services/productApi";
import { add as addValuate } from "../../services/evaluateApi";
import TimeCount from "../TimeCount";
import EditProductPage from "../../pages/EditProductPage";
import { useHistory } from "react-router-dom";

export default function SellProductItem(props) {
  const history = useHistory();
  const { product } = props;
  const { TextArea } = Input;
  const { user } = useSelector((state) => state.user?.user);
  const [formEvaluate] = Form.useForm();
  const [isNew, setIsNew] = useState(true);
  const [currentBidder, setCurrentBidder] = useState({});
  const [isEndTime, setIsEndTime] = useState(false);
  const [countAuction, setCountAuction] = useState(0);
  const [isModalCancelTransaction, setIsModalCancelTransaction] =
    useState(false);
  const [isModalEvaluateVisible, setIsModalEvaluateVisible] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (product.currentBidderId) {
        const currentBidder = await getUserById(product.currentBidderId);
        const history = await getAllHistory(product.id);
        setCountAuction(history.length);
        const nameSplit = currentBidder.username.split(" ");
        currentBidder.username = `***${nameSplit[nameSplit.length - 1]}`;
        setCurrentBidder({ ...currentBidder });
      }
    };
    fetchData();
    const currentTime = moment();
    const dayPassed = currentTime.diff(moment(product.postingDate), "days");
    if (dayPassed > 1) setIsNew(false);
  }, [product]);

  const onEvaluateClick = (values) => {
    const nameSplit = user.username.split(" ");
    user.username = `***${nameSplit[nameSplit.length - 1]}`;
    if (values.evaluate === "like") {
      addValuate(
        user?.id,
        user.username,
        product.currentBidderId,
        values.content,
        1,
        moment(),
        product.id
      ).then(() => {
        message.success("Đánh giá thành công");
      });
    } else {
      addValuate(
        user?.id,
        user.username,
        product.currentBidderId,
        values.content,
        -1,
        moment(),
        product.id
      ).then(() => {
        message.success("Đánh giá thành công");
      });
    }
    setIsModalEvaluateVisible(false);
  };

  const onOkCancelTransactionClick = () => {
    addValuate(
      user?.id,
      user.username,
      product.currentBidderId,
      "Không thích",
      -1,
      moment(),
      product.id
    ).then(() => {
      message.success("Huỷ giao dịch thành công");
    });
    setIsModalCancelTransaction(false);
  };
  const handleEdit = () => {
    setOpenEdit(true);
  };

  const handleOnClick = () => {
    history.push(`/product/${product?.id}`);
  };

  return openEdit ? (
    <EditProductPage product={product}></EditProductPage>
  ) : (
    <div {...props} className={styles.productItemContainer}>
      <Badge.Ribbon
        text="Sản phẩm mới"
        color="red"
        placement="start"
        style={{
          fontFamily: "Work Sans, sans-serif",
          display: isNew ? "block" : "none",
        }}
      >
        <div className={styles.productItem}>
          <Image
            width={props?.width || 200}
            src={`${BACKEND_DOMAIN}${product.images[0]}`}
            alt={product.title}
            preview={false}
          />
          <div className={styles.info}>
            <div className={styles.name}>
              {isEndTime ? (
                <Text.h3 title={product.title}></Text.h3>
              ) : (
                <Link to={`/product/${product.id}`} style={{ color: "#333" }}>
                  <Text.h3 title={product.title}></Text.h3>
                </Link>
              )}
            </div>
            <Divider style={{ margin: "20px 0" }} />
            <div className={styles.infoCenter}>
              <div className={styles.infoCenterTitle}>
                <div>
                  <Text.caption
                    title="Giá hiện tại"
                    style={{ color: "#919293", marginBottom: "4px" }}
                  />
                </div>
                <div>
                  <Text.caption
                    title="Kết thúc sau"
                    style={{ color: "#919293", marginBottom: "4px" }}
                  />
                </div>
              </div>
              <div className={styles.infoCenterValue}>
                <div>
                  <Text.h2
                    title={`${product.currentPrice
                      .toString()
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
                  />
                </div>
                <div>
                  {product.status === "processing" ? (
                    <TimeCount
                      productEndTime={product.endTime}
                      callBackTimeEnd={() => setIsEndTime(true)}
                    >
                      <Text.h3 />
                    </TimeCount>
                  ) : (
                    <Text.h3 title="Đã kết thúc" />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.infoBottom}>
              <div className={styles.infoCenterTitle}>
                <div>
                  <Text.caption
                    title="Người đặt cao nhất"
                    style={{ color: "#919293", marginBottom: "4px" }}
                  />
                </div>
                <div>
                  <Text.caption
                    title="Số lượt ra giá"
                    style={{ color: "#919293", marginBottom: "4px" }}
                  />
                </div>
              </div>
              <div className={styles.infoCenterValue}>
                <div className={styles.hightBidder}>
                  <Text.bodyHighlight title={currentBidder.username} />{" "}
                  {currentBidder.score >= 0 ? (
                    <p className={styles.percent}>
                      <Text.caption
                        title={`${
                          currentBidder.score ? currentBidder.score : 0
                        }%`}
                        style={{ color: "#fff" }}
                      />
                    </p>
                  ) : null}
                </div>
                {currentBidder && (
                  <div className={styles.view}>
                    <Text.bodyHighlight
                      title={`${countAuction ? countAuction : 0} Lượt`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <div>
              {product.status !== "sold" ? (
                <Button
                  onClick={() => {
                    handleEdit();
                  }}
                  className={styles.action}
                  style={{
                    height: "40px",
                  }}
                >
                  <EditOutlined />
                  <Text.bodyHighlight title={`Cập nhật thông tin`} />
                </Button>
              ) : (
                <div>
                  <Button
                    onClick={() => setIsModalEvaluateVisible(true)}
                    className={styles.action}
                    style={{
                      height: "40px",
                    }}
                  >
                    <Text.bodyHighlight title={`Đánh giá người thắng`} />
                  </Button>
                  <Button
                    onClick={() => {
                      handleOnClick();
                    }}
                    className={styles.action}
                    style={{
                      height: "40px",
                    }}
                  >
                    <Text.bodyHighlight title={`Xem sản phẩm`} />
                  </Button>

                  {/* <Button
                    onClick={() => setIsModalCancelTransaction(true)}
                    className={styles.action}
                    style={{
                      height: "40px",
                    }}
                  >
                    <Text.bodyHighlight title={`Huỷ giao dịch`} />
                  </Button> */}
                </div>
              )}
            </div>

            <div className={styles.postingDate}>
              <Text.caption
                title="Sản phẩm này được đăng tải ngày"
                style={{ color: "#919293", marginBottom: "6px" }}
              />
              <Text.bodyHighlight
                title={`${moment(product.postingDate).format(
                  "DD-MM-YYYY HH:mm"
                )}`}
              />
            </div>
          </div>
        </div>
      </Badge.Ribbon>{" "}
      <Modal
        title={<Text.bodyHighlight title="Đánh giá người thắng" />}
        visible={isModalEvaluateVisible}
        onOk={() => formEvaluate.submit()}
        onCancel={() => setIsModalEvaluateVisible(false)}
        okText={<Text.caption title="Gửi đánh giá" />}
        cancelText={<Text.caption title="Hủy" />}
      >
        <Text.caption title="Bạn có nhận xét về người mua này?" />
        <Form form={formEvaluate} onFinish={onEvaluateClick}>
          <Form.Item name="evaluate">
            <Radio.Group defaultValue="like" style={{ marginTop: "8px" }}>
              <Radio.Button value="like" style={{ marginRight: "20px" }}>
                <LikeOutlined />
                <Text.caption title="  Thích (+1)" />
              </Radio.Button>
              <Radio.Button value="unlike">
                <DislikeOutlined />
                <Text.caption title="  Không thích (-1)" />
              </Radio.Button>
            </Radio.Group>
          </Form.Item>{" "}
          <Text.caption title="Nhận xét(không bắt buộc)" />
          <Form.Item name="content">
            <TextArea rows={4} style={{ marginTop: "8px" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<Text.bodyHighlight title="Xác nhận ra giá" />}
        visible={isModalCancelTransaction}
        onOk={() => onOkCancelTransactionClick()}
        onCancel={() => setIsModalCancelTransaction(false)}
        okText={<Text.caption title="Đồng ý" />}
        cancelText={<Text.caption title="Hủy" />}
      >
        <Text.caption
          title={`Huỷ giao dịch đồng nghĩa với việc người thắng không thanh toán. Bằng việc nhấn nút “Đồng ý”, bạn sẽ gửi đánh giá “Không thích” (-1 điểm) đến người mua này.
              Bạn có chắc muốn tiếp tục?`}
        />
      </Modal>
    </div>
  );
}
