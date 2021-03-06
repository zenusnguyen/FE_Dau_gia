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
        currentBidder.username = `***${currentBidder.username.substr(1, 3)}***`;

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
    user.username = `***${user.username.substr(1, 3)}***`;
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
        message.success("?????u gi?? th??nh c??ng");
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
          message.success("?????u gi?? th??nh c??ng");
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
        <div>
          <Badge.Ribbon
            text="Sa??n ph????m m????i"
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
                        title="Gia?? hi????n ta??i"
                        style={{
                          color: "#919293",
                          marginBottom: "4px",
                        }}
                      />
                    </div>
                    <div>
                      <Text.caption
                        title="K???t th??c sau"
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
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`}
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
                        <Text.h3 title="???? k???t th??c" />
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.infoBottom}>
                  <div className={styles.infoCenterTitle}>
                    <div>
                      <Text.caption
                        title="Ng??????i ??????t cao nh????t"
                        style={{
                          color: "#919293",
                          marginBottom: "4px",
                        }}
                      />
                    </div>
                    <div>
                      <Text.caption
                        title="S???? l??????t ra gia??"
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
                        title={`${countAuction ? countAuction : 0} L??????t`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                {product.status === "processing" ? (
                  <div>
                    <Button
                      onClick={() => {
                        handleOnClick();
                      }}
                      className={styles.action}
                      style={{
                        height: "40px",
                      }}
                    >
                      <Text.bodyHighlight title={`Xem s???n ph???m`} />
                    </Button>
                    {/* <Button
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
                        title={`??????u gia?? - ${(
                          product.currentPrice + (product.priceStep || 0)
                        )
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`}
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
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`}
                        />
                      </Button>
                    )} */}
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
                        title={isLike ? `???? Y??u thi??ch` : `Y??u thi??ch`}
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
                      <Text.bodyHighlight title="????nh gi?? ng?????i b??n" />
                    </Button>
                  </div>
                )}
                <div className={styles.postingDate}>
                  <Text.caption
                    title="Sa??n ph????m na??y ????????c ????ng ta??i nga??y"
                    style={{ color: "#919293", marginBottom: "6px" }}
                  />
                  <Text.bodyHighlight
                    title={`${moment(product.createdAt).format(
                      "DD-MM-YYYY HH:mm"
                    )}`}
                  />
                </div>
              </div>
            </div>
          </Badge.Ribbon>
          <Modal
            title={<Text.bodyHighlight title="X??c nh???n mua h??ng" />}
            visible={isModalBuyVisible}
            onOk={() => {}}
            onCancel={() => setIsModalBuyVisible(false)}
            okText={<Text.caption title="?????ng ??" />}
            cancelText={<Text.caption title="H???y" />}
          >
            <Text.caption
              title={`B???n s??? mua m???t h??ng n??y v???i gi?? ${product.maxPrice
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}???`}
            />
          </Modal>
          <Modal
            title={<Text.bodyHighlight title="X??c nh???n ra gi??" />}
            visible={isModalAuctionVisible}
            onOk={() => {}}
            onCancel={() => setIsModalAuctionVisible(false)}
            okText={<Text.caption title="?????ng ??" />}
            cancelText={<Text.caption title="H???y" />}
          >
            <Text.caption
              title={`B???n s??? ra gi?? ${(product.currentPrice + product.priceStep)
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}?? cho m???t h??ng n??y?`}
            />
          </Modal>
          <Modal
            title={<Text.bodyHighlight title="????nh gi?? ng?????i b??n" />}
            visible={isModalEvaluateVisible}
            onOk={() => form.submit()}
            onCancel={() => setIsModalEvaluateVisible(false)}
            okText={<Text.caption title="G???i ????nh gi??" />}
            cancelText={<Text.caption title="H???y" />}
          >
            <Text.caption title="B???n th??ch tr???i nghi???m mua h??ng n??y ch????" />
            <Form form={form} onFinish={onEvaluateClick}>
              <Form.Item name="evaluate">
                <Radio.Group defaultValue="like" style={{ marginTop: "8px" }}>
                  <Radio.Button value="like" style={{ marginRight: "20px" }}>
                    <LikeOutlined />
                    <Text.caption title="  Th??ch (+1)" />
                  </Radio.Button>
                  <Radio.Button value="unlike">
                    <DislikeOutlined />
                    <Text.caption title="  Kh??ng th??ch (-1)" />
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>{" "}
              <Text.caption title="Nh???n x??t(kh??ng b???t bu???c)" />
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
