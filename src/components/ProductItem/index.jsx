/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Text from "../Text";
import "./style.css";
import { useSelector } from "react-redux";
import { Image, Button, Divider, Badge, Modal, Input, Radio } from "antd";
import {
   HeartOutlined,
   LikeOutlined,
   DislikeOutlined,
} from "@ant-design/icons";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { BACKEND_DOMAIN } from "../../constants";
import { add as addWatch, del as delWatch } from "../../services/wathApi";
import moment from "moment";

export default function ProductItem(props) {
   const { TextArea } = Input;
   const { user } = useSelector((state) => state.user);
   const { product, callBackUnLike } = props;
   const [isLike, setIsLike] = useState(product.isLike);
   const [timeRemaining, setTimeRemaining] = useState("");
   const [isNew, setIsNew] = useState(true);
   const [isModalBuyVisible, setIsModalBuyVisible] = useState(false);
   const [isModalAuctionVisible, setIsModalAuctionVisible] = useState(false);
   const [isModalEvaluateVisible, setIsModalEvaluateVisible] = useState(false);

   useEffect(() => {
      const currentTime = moment();
      const endTime = moment(product.postingDate).add(5, "day");
      const minutes = endTime.diff(currentTime, "minutes");
      const hours = endTime.diff(currentTime, "hours");
      const day = endTime.diff(currentTime, "days");
      if (day > 0) {
         if (day < 3) {
            if (day === 0) {
               if (hours === 0) {
                  setTimeRemaining(`${minutes} minutes left`);
               } else {
                  setTimeRemaining(`${hours} hours left`);
               }
            } else {
               setTimeRemaining(`${day} days left`);
            }
         } else {
            setTimeRemaining(`${day}d ${hours - 24 * day}h`);
         }
      } else {
         setTimeRemaining(`${hours} hours left`);
      }
      const minutesAgo = currentTime.diff(
         moment(product.postingDate),
         "minutes"
      );
      if (minutesAgo >= 30) setIsNew(false);
   }, [product]);

   const onLikeClick = () => {
      setIsLike(!isLike);
      if (!isLike) {
         addWatch(product.id, user.id);
      } else {
         delWatch(product.id, user.id);
         if (callBackUnLike) {
            callBackUnLike(product.id);
         }
      }
   };

   const handleBuyClick = () => {};

   const handleAuctionClick = () => {};

   return (
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
               />
               <div className={styles.info}>
                  <div className={styles.name}>
                     <Link
                        to={`/product/${product.id}`}
                        style={{ color: "#333" }}
                     >
                        <Text.h3 title={product.title}></Text.h3>
                     </Link>
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
                              <Text.h3
                                 title={timeRemaining}
                                 style={{ color: "red" }}
                              />
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
                           {product.bidder && (
                              <Text.bodyHighlight
                                 title={product.currentBidder.name}
                              />
                           )}
                           {/* <p className={styles.percent}>
                              <Text.caption
                                 title={`${bidder.percent}%`}
                                 style={{ color: "#fff" }}
                              />
                           </p> */}
                        </div>
                        <div className={styles.view}>
                           <Text.bodyHighlight title={`${product.view} Lượt`} />
                        </div>
                     </div>
                  </div>
               </div>
               <div className={styles.actions}>
                  {product.status === "processing" ? (
                     <div>
                        <Button
                           onClick={() => setIsModalAuctionVisible(true)}
                           type="primary"
                           className={`${styles.action} ${styles.danger}`}
                           style={{
                              backgroundColor: "#E53238",
                              borderColor: "#E53238",
                              height: "40px",
                           }}
                        >
                           <Text.bodyHighlight
                              title={`Đấu giá - ${(
                                 product.currentPrice + product.rating
                              )
                                 .toString()
                                 .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
                           />
                        </Button>
                        {product.maxPrice && (
                           <Button
                              onClick={() => setIsModalBuyVisible(true)}
                              type="primary"
                              className={`${styles.action} ${styles.primary}`}
                              style={{
                                 height: "40px",
                                 backgroundColor: "#0064D2",
                                 borderColor: "#0064D2",
                              }}
                           >
                              <Text.bodyHighlight
                                 title={`Mua ngay - ${product.maxPrice
                                    .toString()
                                    .replace(
                                       /(\d)(?=(\d{3})+(?!\d))/g,
                                       "$1."
                                    )}đ`}
                              />
                           </Button>
                        )}
                        <Button
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
               title={`Bạn sẽ ra giá ${(product.currentPrice + product.rating)
                  .toString()
                  .replace(
                     /(\d)(?=(\d{3})+(?!\d))/g,
                     "$1."
                  )}đ cho mặt hàng này?`}
            />
         </Modal>
         <Modal
            title={<Text.bodyHighlight title="Đánh giá người bán" />}
            visible={isModalEvaluateVisible}
            onOk={() => {}}
            onCancel={() => setIsModalEvaluateVisible(false)}
            okText={<Text.caption title="Gửi đánh giá" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Text.caption title="Bạn thích trải nghiệm mua hàng này chứ?" />
            <div>
               <Radio.Group
                  defaultValue="a"
                  style={{ marginTop: "8px", marginBottom: "28px" }}
               >
                  <Radio.Button value="a" style={{ marginRight: "20px" }}>
                     <LikeOutlined />
                     <Text.caption title="  Thích (+1)" />
                  </Radio.Button>
                  <Radio.Button value="b">
                     <DislikeOutlined />
                     <Text.caption title="  Không thích (-1)" />
                  </Radio.Button>
               </Radio.Group>
            </div>
            <Text.caption title="Nhận xét(không bắt buộc)" />
            <TextArea rows={4} style={{ marginTop: "8px" }} />
         </Modal>
      </div>
   );
}
