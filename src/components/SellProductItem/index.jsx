/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import Text from "../Text";
import { Image, Button, Divider, Badge } from "antd";
import { EditOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { BACKEND_DOMAIN } from "../../constants";
import moment from "moment";
import { getById as getUserById } from "../../services/userApi";
import { getAllHistory } from "../../services/productApi";
import TimeCount from "../TimeCount";

export default function SellProductItem(props) {
   const { product } = props;
   const [isNew, setIsNew] = useState(true);
   const [currentBidder, setCurrentBidder] = useState({});
   const [isEndTime, setIsEndTime] = useState(false);
   const [countAuction, setCountAuction] = useState(0);

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
                  alt={product.title}
                  preview={false}
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
                           {currentBidder.score && (
                              <p className={styles.percent}>
                                 <Text.caption
                                    title={`${currentBidder.score * 10}%`}
                                    style={{ color: "#fff" }}
                                 />
                              </p>
                           )}
                        </div>
                        {currentBidder && (
                           <div className={styles.view}>
                              <Text.bodyHighlight
                                 title={`${
                                    countAuction ? countAuction : 0
                                 } Lượt`}
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
                              className={styles.action}
                              style={{
                                 height: "40px",
                              }}
                           >
                              <Text.bodyHighlight
                                 title={`Đánh giá người thắng`}
                              />
                           </Button>
                           <Button
                              className={styles.action}
                              style={{
                                 height: "40px",
                              }}
                           >
                              <Text.bodyHighlight title={`Huỷ giao dịch`} />
                           </Button>
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
         </Badge.Ribbon>
      </div>
   );
}
