/* eslint-disable react/jsx-pascal-case */
import React from "react";
import Text from "../Text";
import { Image, Button, Divider, Badge } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

export default function ProductItem(props) {
   const {
      title,
      price,
      timming,
      view,
      src,
      bidder,
      postingDate,
      buyNow,
      auctionMoney,
   } = props;
   return (
      <div {...props} className={styles.productItemContainer}>
         <Badge.Ribbon
            text="Sản phẩm mới"
            color="red"
            placement="start"
            style={{ fontFamily: "Work Sans, sans-serif" }}
         >
            <div className={styles.productItem}>
               <Image
                  width={props?.width || 200}
                  src={src}
                  alt={title}
                  preview={false}
               />
               <div className={styles.info}>
                  <div className={styles.name}>
                     <Text.h3 title={title}></Text.h3>
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
                           <Text.h2 title={price} />
                        </div>
                        <div>
                           <Text.h3 title={timming} style={{ color: "red" }} />
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
                           <Text.bodyHighlight title={bidder.name} />
                           <p className={styles.percent}>
                              <Text.caption
                                 title={`${bidder.percent}%`}
                                 style={{ color: "#fff" }}
                              />
                           </p>
                        </div>
                        <div className={styles.view}>
                           <Text.bodyHighlight title={`${view} Lượt`} />
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
                           title={`Đấu giá - ${auctionMoney}`}
                        />
                     </Button>
                     {buyNow && (
                        <Button
                           type="primary"
                           className={styles.action}
                           style={{
                              height: "40px",
                           }}
                        >
                           <Text.bodyHighlight title={`Mua ngay - ${buyNow}`} />
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
                     <Text.bodyHighlight title={`${postingDate}`} />
                  </div>
               </div>
            </div>
         </Badge.Ribbon>
      </div>
   );
}
