/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
import { Breadcrumb, Image, Divider, Tag, Collapse, Button } from "antd";
import Text from "../../components/Text";
import SlideProduct from "../../components/SlideProduct";
import { HeartOutlined } from "@ant-design/icons";
import { get, getAllHistory } from "../../services/productApi";
import { getById } from "../../services/categoryApi";
import { getByBidder } from "../../services/wathApi";
import { add as addWatch, del as delWatch } from "../../services/wathApi";
import moment from "moment";
import { BACKEND_DOMAIN } from "../../constants";
import { Table } from "antd";
import { useSelector } from "react-redux";
import LoadingPage from "../LoadingPage";

const columnsTable = [
   {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
   },
   {
      title: "Người mua",
      dataIndex: "bidder",
      key: "bidder",
   },
   {
      title: "Giá",
      dataIndex: "price",
      key: "price",
   },
];

const { Panel } = Collapse;

export default function ItemDetailPage({ data }) {
   const { user } = useSelector((state) => state.user);
   const { productId } = useParams();
   const [product, setProduct] = useState({});
   const [currentImage, setCurrentImage] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [timeRemaining, setTimeRemaining] = useState("");
   const [histories, setHistories] = useState([]);
   const [breadcrumb, setBreadcrumb] = useState([]);
   const [isLike, setIsLike] = useState(false);

   const SubImage = ({ src, index }) => {
      return (
         <Image
            className={styles.subImage}
            src={`${BACKEND_DOMAIN}${src}`}
            width={80}
            preview={false}
            onClick={() => onImageClick(index)}
         ></Image>
      );
   };

   useEffect(() => {
      const fetchData = async () => {
         const productRes = await get(productId);
         const currentCategory = await getById(productRes.categoryID);
         const allHistory = await getAllHistory(productId);
         const allLike = await getByBidder(user?.user.id);
         const likes = allLike.map((like) => like.productId);
         if (likes.includes(productRes.id)) {
            setIsLike(true);
         } else {
            setIsLike(false);
         }
         setProduct(productRes);
         const currentTime = moment();
         const endTime = moment(productRes.postingDate).add(5, "day");
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

         console.log(allHistory);

         const historiesData = allHistory.map((history, i) => {
            return {
               key: i.toString(),
               time: moment(history.time).format("DD-MM-YYYY HH:mm"),
               bidder: history.buyer.name,
               price: `${history.price
                  .toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`,
            };
         });

         const currentSub = currentCategory.subCategory.find(
            (subCategory) => subCategory.id === productRes.subCategoryId
         );

         setBreadcrumb([
            currentCategory.name,
            currentSub.name,
            productRes.title,
         ]);

         setHistories(historiesData);

         setIsLoading(false);
      };

      fetchData();
   }, [productId]);

   const onImageClick = (index) => {
      setCurrentImage(index);
   };

   const onLikeClick = () => {
      setIsLike(!isLike);
      if (!isLike) {
         addWatch(productId, user.id);
      } else {
         delWatch(productId, user.id);
      }
   };

   function callback(key) {}
   return (
      <div className={styles.container}>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               <Breadcrumb style={{ marginBottom: "30px" }}>
                  <Breadcrumb.Item>
                     <Text.caption title="Trang chủ" />
                  </Breadcrumb.Item>
                  {breadcrumb.map((item) => (
                     <Breadcrumb.Item>
                        <Text.caption title={item} />
                     </Breadcrumb.Item>
                  ))}
               </Breadcrumb>
               <div className={styles.itemWrapper}>
                  <div className={styles.imageGroup}>
                     <div className={styles.subImageGroup}>
                        {product.images.map((image, index) => {
                           return (
                              <SubImage
                                 key={index.toString()}
                                 src={image}
                                 index={index}
                              ></SubImage>
                           );
                        })}
                     </div>
                  </div>
                  <div className={styles.itemDetail}>
                     <Image
                        className={styles.mainImage}
                        src={`${BACKEND_DOMAIN}${product.images[currentImage]}`}
                        width={400}
                     ></Image>
                     <div className={styles.itemDescription}>
                        <Text.h3 title={product.title}></Text.h3>
                        <Divider></Divider>
                        <div className={styles.currentGroup}>
                           <div className={styles.currentGroupTitle}>
                              <div className={styles.currentGroupItem}>
                                 <Text.caption
                                    title="Gíá hiện tại"
                                    style={{ color: "#919293" }}
                                 />
                              </div>
                              <div className={styles.currentGroupItem}>
                                 <Text.caption
                                    title="Kết thức sau"
                                    style={{ color: "#919293" }}
                                 />
                              </div>
                           </div>
                           <div className={styles.currentGroupValue}>
                              <div className={styles.currentGroupItem}>
                                 <Text.h2
                                    title={`${product.currentPrice
                                       .toString()
                                       .replace(
                                          /(\d)(?=(\d{3})+(?!\d))/g,
                                          "$1."
                                       )}đ`}
                                 />
                              </div>
                              <div className={styles.currentGroupItem}>
                                 <Text.h3
                                    style={{ color: "red" }}
                                    title={timeRemaining}
                                 />
                              </div>
                           </div>
                        </div>
                        <div className={styles.topAuction}>
                           <Text.caption
                              title="Người đặt giá cao nhất"
                              style={{ color: "#919293" }}
                           />
                           <div
                              className={styles.topAuctionConetnt}
                              style={{ marginTop: "5px" }}
                           >
                              <Text.bodyHighlight
                                 title={product.currentBidder.name}
                              />
                              <Tag className={styles.tag} color="#86b817">
                                 <Text.caption
                                    title={`${
                                       product.currentBidder.score * 10
                                    }%`}
                                 />
                              </Tag>
                           </div>
                        </div>
                        <div className={styles.collapsedWrapper}>
                           <Collapse onChange={callback} bordered={false}>
                              <Panel
                                 header={
                                    <Text.caption title="Mô tả chi tiết" />
                                 }
                                 key="1"
                              >
                                 <Text.caption title={product.description} />
                              </Panel>
                              <Panel
                                 header={
                                    <Text.caption
                                       title={`Lịch sử đấu giá (${product.view} lượt)`}
                                    />
                                 }
                                 key="2"
                              >
                                 <Table
                                    columns={columnsTable}
                                    dataSource={histories}
                                 />
                              </Panel>
                           </Collapse>
                        </div>
                     </div>
                     <div className={styles.rightGroup}>
                        <div className={styles.seller}>
                           <div className={styles.sellerTop}>
                              <Text.caption
                                 title="Người bán"
                                 style={{
                                    color: "#919293",
                                    marginBottom: "4px",
                                 }}
                              />
                              <div className={styles.topAuction}>
                                 <Text.bodyHighlight
                                    title={product.seller.name}
                                 />
                                 <Tag className={styles.tag} color="#86b817">
                                    <Text.caption
                                       title={`${product.seller.score * 10}%`}
                                    />
                                 </Tag>
                              </div>
                           </div>
                           <div className={styles.buttonGroup}>
                              <Button className={styles.auction}>
                                 <Text.bodyHighlight
                                    title={`Đấu giá - ${(
                                       product.currentPrice + product.rating
                                    )
                                       .toString()
                                       .replace(
                                          /(\d)(?=(\d{3})+(?!\d))/g,
                                          "$1."
                                       )}đ`}
                                 />
                              </Button>
                              <Button className={styles.buyNow}>
                                 <Text.bodyHighlight
                                    title={`Mua ngay - ${product.maxPrice
                                       .toString()
                                       .replace(
                                          /(\d)(?=(\d{3})+(?!\d))/g,
                                          "$1."
                                       )}đ`}
                                 />
                              </Button>
                              <Button className={styles.autoAuction}>
                                 <Text.bodyHighlight title="Đấu giá tự động" />
                              </Button>
                              <Button
                                 onClick={() => onLikeClick()}
                                 icon={<HeartOutlined />}
                                 className={isLike ? styles.liked : styles.like}
                              >
                                 <Text.bodyHighlight
                                    title={
                                       isLike ? "Đã Yêu thích" : `Yêu thích`
                                    }
                                 />
                              </Button>
                           </div>
                           <div className={styles.postingDate}>
                              <Text.caption
                                 title="Sản phẩm được đăng tải ngày"
                                 style={{
                                    color: "#919293",
                                 }}
                              />
                              <p style={{ marginTop: "6px" }}>
                                 <Text.bodyHighlight
                                    title={`${moment(
                                       product.postingDate
                                    ).format("DD-MM-YYYY HH:mm")}`}
                                 />
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div
                  className={styles.silderWrapper}
                  style={{ marginTop: "50px" }}
               >
                  <SlideProduct
                     title="Sản phẩm tương tự"
                     products={product.products}
                  />
               </div>
            </div>
         )}
      </div>
   );
}
