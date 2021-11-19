/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Text from "../Text";
import { useSelector } from "react-redux";
import {
  Image,
  Button,
  Divider,
  Badge,
  Modal,
  Input,
  Radio,
  Skeleton,
  Form,
  message,
} from "antd";
import {
  HeartOutlined,
  LikeOutlined,
  DislikeOutlined,
} from "@ant-design/icons";
import styles from "./styles.module.css";
import { Link, useHistory } from "react-router-dom";
import { BACKEND_DOMAIN } from "../../constants";
import { add as addWatch, del as delWatch } from "../../services/wathApi";
import { add as addValuate } from "../../services/evaluateApi";
import { getById as getUserById } from "../../services/userApi";
import { getBySender } from "../../services/evaluateApi";
import { createAuctionTransaction } from "../../services/priceHistoryApi";
import { getAllHistory } from "../../services/productApi";
import { socket } from "../../services/socket";

import moment from "moment";
import TimeCount from "../TimeCount";

export default function ProductItem(props) {
  const { TextArea } = Input;
  const { user } = useSelector((state) => state.user?.user);
  const history = useHistory();
  const [form] = Form.useForm();
  const { product, callBackUnLike } = props;
  const [isLike, setIsLike] = useState(product.isLike);
  const [isNew, setIsNew] = useState(true);
  const [isModalBuyVisible, setIsModalBuyVisible] = useState(false);
  const [isModalAuctionVisible, setIsModalAuctionVisible] = useState(false);
  const [isModalEvaluateVisible, setIsModalEvaluateVisible] = useState(false);
  const [currentBidder, setCurrentBidder] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluate, setIsEvaluate] = useState(product.isEvaluate);
  const [isEndTime, setIsEndTime] = useState(false);
  const [countAuction, setCountAuction] = useState(0);

  //   socket.on("priceChange", async ({ data }) => {
  //     if (data?.productId == product?.id) {

  //     }
  //   });

  useEffect(() => {
    form.setFieldsValue({
      evaluate: "like",
    });
    const fetchData = async () => {
      if (product.currentBidderId) {
        const currentBidder = await getUserById(product.currentBidderId);
        const history = await getAllHistory(product.id);
        setCountAuction(history.length);
        const nameSplit = currentBidder.username.split(" ");
        currentBidder.username = `***${nameSplit[nameSplit.length - 1]}`;
        setCurrentBidder({ ...currentBidder });
      }
      setIsLoading(false);
    };
    fetchData();
    const currentTime = moment();
    const dayPassed = currentTime.diff(moment(product.postingDate), "days");
    if (dayPassed > 1) setIsNew(false);
  }, [product, form]);

  const onLikeClick = () => {
    if (user) {
      setIsLike(!isLike);
      if (!isLike) {
        addWatch(product.id, user.id);
      } else {
        delWatch(product.id, user.id);
        if (callBackUnLike) {
          callBackUnLike(product.id);
        }
      }
    } else {
      history.push("/login");
    }
  };

  const onEvaluateClick = (values) => {
    const nameSplit = user.username.split(" ");
    user.username = `***${nameSplit[nameSplit.length - 1]}`;
    if (values.evaluate === "like") {
      addValuate(
        user?.id,
        user.username,
        product.ownerId,
        values.content,
        1,
        moment(),
        product.id
      );
    } else {
      addValuate(
        user?.id,
        user.username,
        product.ownerId,
        values.content,
        -1,
        moment(),
        product.id
      );
    }
    setIsModalEvaluateVisible(false);
  };

  const handleBuyClick = async () => {
    const data = {
      time: Date.now(),
      price: product?.maxPrice,
      buyer: user?.id,
      bidderId: product?.ownerId,
      productId: product?.id,
      buyerName: user?.username,
      type: "buy",
    };
    await createAuctionTransaction(data)
      .then((res) => {
        message.success("Đấu giá thành công");
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const handleOnClick = () => {
    history.push(`/product/${product?.id}`);
  };

  const handleAuctionClick = async () => {
    const data = {
      time: Date.now(),
      price: product?.currentPrice + product?.priceStep,
      buyer: user?.id,
      bidderId: product?.ownerId,
      productId: product?.id,
      buyerName: user?.username,
      type: "auction",
    };
    if (product?.currentPrice + product?.priceStep === product.maxPrice) {
      await handleBuyClick();
    } else {
      await createAuctionTransaction(data)
        .then((res) => {
          message.success("Đấu giá thành công");
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    setTimeout(() => {
      // setIsReload(!isReload);
    }, 500);
    //  socket.emit("priceChange", data, (error) => {
    //    console.log("data: ", data);
    //    if (error) {
    //      console.log("error: ", error);
    //    }
    //  });
  };

  return (
    <div {...props} className={styles.productItemContainer}>
      {isLoading ? (
        <div style={{ width: "1040px", height: "280px" }}>
          <Skeleton paragraph={{ rows: 6 }} />
        </div>
      ) : (
        <div
          onClick={() => {
            handleOnClick();
          }}
        >
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
                preview={false}
                width={props?.width || 200}
                src={`${BACKEND_DOMAIN}${product.images[0]}`}
              />
              <div className={styles.info}>
                <div className={styles.name}>
                  {isEndTime ? (
                    <Text.h3 title={product.title}></Text.h3>
                  ) : (
                    <Link
                      to={`/product/${product.id}`}
                      style={{ color: "#333" }}
                    >
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
                        style={{
                          color: "#919293",
                          marginBottom: "4px",
                        }}
                      />
                    </div>
                    <div>
                      <Text.caption
                        title="Kết thúc sau"
                        style={{
                          color: "#919293",
                          marginBottom: "4px",
                        }}
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
                        style={{
                          color: "#919293",
                          marginBottom: "4px",
                        }}
                      />
                    </div>
                    <div>
                      <Text.caption
                        title="Số lượt ra giá"
                        style={{
                          color: "#919293",
                          marginBottom: "4px",
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.infoCenterValue}>
                    <div className={styles.hightBidder}>
                      {currentBidder.username && (
                        <Text.bodyHighlight title={currentBidder.username} />
                      )}
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
                    <div className={styles.view}>
                      <Text.bodyHighlight
                        title={`${countAuction ? countAuction : 0} Lượt`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                {product.status === "processing" ? (
                  <div>
                    <Button
                      disabled={isEndTime}
                      onClick={() => setIsModalAuctionVisible(true)}
                      type="primary"
                      className={`${styles.action} ${styles.danger}`}
                      style={{
                        backgroundColor: "#E53238",
                        borderColor: "#E53238",
                        height: "40px",
                        color: isEndTime ? "#505050" : "#fff",
                      }}
                    >
                      <Text.bodyHighlight
                        title={`Đấu giá - ${(
                          product.currentPrice + (product.priceStep || 0)
                        )
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
                      />
                    </Button>
                    {product.maxPrice !== 0 && (
                      <Button
                        disabled={isEndTime}
                        onClick={() => setIsModalBuyVisible(true)}
                        type="primary"
                        className={`${styles.action} ${styles.primary}`}
                        style={{
                          height: "40px",
                          backgroundColor: "#0064D2",
                          borderColor: "#0064D2",
                          color: isEndTime ? "#505050" : "#fff",
                        }}
                      >
                        <Text.bodyHighlight
                          title={`Mua ngay - ${product.maxPrice
                            .toString()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
                        />
                      </Button>
                    )}
                    <Button
                      disabled={isEndTime}
                      onClick={onLikeClick}
                      className={
                        isLike
                          ? `${styles.action} ${styles.like}`
                          : `${styles.action} `
                      }
                      style={{
                        height: "40px",
                      }}
                    >
                      <HeartOutlined />
                      <Text.bodyHighlight
                        title={isLike ? `Đã Yêu thích` : `Yêu thích`}
                      />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={() => setIsModalEvaluateVisible(true)}
                      className={`${styles.action} `}
                      style={{
                        height: "40px",
                      }}
                      disabled={isEvaluate}
                    >
                      <Text.bodyHighlight title="Đánh giá người bán" />
                    </Button>
                  </div>
                )}
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
          </Badge.Ribbon>
          <Modal
            title={<Text.bodyHighlight title="Xác nhận mua hàng" />}
            visible={isModalBuyVisible}
            onOk={() => {}}
            onCancel={() => setIsModalBuyVisible(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
          >
            <Text.caption
              title={`Bạn sẽ mua mặt hàng này với giá ${product.maxPrice
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ?`}
            />
          </Modal>
          <Modal
            title={<Text.bodyHighlight title="Xác nhận ra giá" />}
            visible={isModalAuctionVisible}
            onOk={() => {}}
            onCancel={() => setIsModalAuctionVisible(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
          >
            <Text.caption
              title={`Bạn sẽ ra giá ${(product.currentPrice + product.priceStep)
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ cho mặt hàng này?`}
            />
          </Modal>
          <Modal
            title={<Text.bodyHighlight title="Đánh giá người bán" />}
            visible={isModalEvaluateVisible}
            onOk={() => form.submit()}
            onCancel={() => setIsModalEvaluateVisible(false)}
            okText={<Text.caption title="Gửi đánh giá" />}
            cancelText={<Text.caption title="Hủy" />}
          >
            <Text.caption title="Bạn thích trải nghiệm mua hàng này chứ?" />
            <Form form={form} onFinish={onEvaluateClick}>
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
        </div>
      )}
    </div>
  );
}
