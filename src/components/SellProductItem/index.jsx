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

export default function SellProductItem(props) {
   const { product } = props;
   const [timeRemaining, setTimeRemaining] = useState("");
   const [isNew, setIsNew] = useState(true);
   const [currentBidder, setCurrentBidder] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         if (product.currentBidderId) {
            const currentBidder = await getUserById(product.currentBidderId);
            const nameSplit = currentBidder.fullName.split(" ");
            currentBidder.fullName = `***${nameSplit[nameSplit.length - 1]}`;
            setCurrentBidder({ ...currentBidder });
         }
         setIsLoading(false);
      };
      fetchData();
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

   return (
      <div {...props} className={styles.productItemContainer}>
         <div className={styles.productItem}>
            <Image
               width={props?.width || 200}
               src={`${BACKEND_DOMAIN}${product.images[0]}`}
               alt={product.title}
               preview={false}
            />
            <div className={styles.info}>
               <div className={styles.name}>
                  <Link to={`/product/${product.id}`} style={{ color: "#333" }}>
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
                        <Text.bodyHighlight title={currentBidder.fullName} />{" "}
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
                           <Text.bodyHighlight title={`${product.view} Lượt`} />
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
                           <Text.bodyHighlight title={`Đánh giá người thắng`} />
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
      </div>
   );
}
