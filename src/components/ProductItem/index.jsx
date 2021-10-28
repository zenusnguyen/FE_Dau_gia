/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Text from "../Text";
import { Image, Button, Divider, Badge } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { BACKEND_DOMAIN } from "../../constants";
import moment from "moment";

export default function ProductItem(props) {
   const { product } = props;
   const [timeRemaining, setTimeRemaining] = useState("");
   const [isNew, setIsNew] = useState(true);

   useEffect(() => {
      const currentTime = moment();
      const endTime = moment(product.postingDate).add(5, "day");
      const minutes = endTime.diff(currentTime, "minutes");
      const hours = endTime.diff(currentTime, "hours");
      const day = endTime.diff(currentTime, "days");
      if (day > 0) {
         setTimeRemaining(`${day}d ${hours - 24 * day}h`);
      } else {
         setTimeRemaining(`${hours}h`);
      }
      const hoursAgo = currentTime.diff(moment(product.postingDate), "hours");
      const minutesAgo = currentTime.diff(
         moment(product.postingDate),
         "minutes"
      );
      console.log(minutesAgo - hoursAgo * 60);
      if (minutesAgo - hoursAgo * 60 >= 30) setIsNew(false);
   }, [product]);

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
                  preview={false}
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
                           <Text.h3
                              title={timeRemaining}
                              style={{ color: "red" }}
                           />
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
                           <Text.bodyHighlight title={product.currentOrderId} />
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
                  <div>
                     <Button
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
                           type="primary"
                           className={styles.action}
                           style={{
                              height: "40px",
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
                        className={styles.action}
                        style={{
                           height: "40px",
                        }}
                     >
                        <HeartOutlined />
                        <Text.bodyHighlight title={`Yêu thích`} />
                     </Button>
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
         </Badge.Ribbon>
      </div>
   );
}
