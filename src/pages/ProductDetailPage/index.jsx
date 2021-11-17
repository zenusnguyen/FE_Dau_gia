/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { useParams, useHistory } from "react-router-dom";
import {
  Breadcrumb,
  Image,
  Divider,
  Tag,
  Collapse,
  Button,
  message,
} from "antd";
import Text from "../../components/Text";
import SlideProduct from "../../components/SlideProduct";
import { HeartOutlined } from "@ant-design/icons";
import { get, getAllHistory, getTheSame } from "../../services/productApi";
import { getById } from "../../services/categoryApi";
import { getByBidder as getWatchByBidder } from "../../services/wathApi";
import { getById as getUserById } from "../../services/userApi";
import { add as addWatch, del as delWatch } from "../../services/wathApi";
import { getLastBidder, getAllByProduct } from "../../services/priceHistoryApi";
import moment from "moment";
import { BACKEND_DOMAIN } from "../../constants";
import { Table } from "antd";
import { useSelector } from "react-redux";
import LoadingPage from "../LoadingPage";
import { createAuctionTransaction } from "../../services/priceHistoryApi";
import { createAutoAuctionTransaction } from "../../services/autoAuction";
import { socket } from "../../services/socket";

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
  const { user } = useSelector((state) => state.user?.user);
  const history = useHistory();
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [histories, setHistories] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const [currentSeller, setCurrentSeller] = useState({});
  const [isReload, setIsReload] = useState(false);

  const [currentBidder, setCurrentBidder] = useState({});
  const [productsTheSame, setProductsTheSame] = useState([]);

  socket.on("priceChange", async ({ data }) => {
    if (data?.productId == product?.id) {
      const productRes = await get(productId);
      setProduct(productRes);
      const historyList = await getAllHistory(productId);
      setHistories(
        historyList.map((auction, i) => {
          return {
            key: i.toString(),
            time: moment(auction.time).format("DD-MM-YYYY HH:mm"),
            bidder: auction?.buyerName,
            price: `${auction?.price
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`,
          };
        })
      );
    }
  });
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
    setIsLoading(true);
    const fetchData = async () => {
      const productRes = await get(productId);
      setProduct(productRes);
      setTimeout(async () => {
        Promise.all([
          getUserById(productRes?.ownerId),
          getTheSame(productRes.id, productRes.subCategoryId),
          getWatchByBidder(user?.id),
          getAllHistory(productId),
          getUserById(
            productRes.currentBidderId ? productRes.currentBidderId : ""
          ),
        ]).then((values) => {
          setCurrentSeller(values[0]);
          setProductsTheSame(values[1]);
          const likes = values[2].map((like) => like.productId);
          setIsLike(likes.includes(productRes.id));
          setHistories(
            values[3].map((auction, i) => {
              return {
                key: i.toString(),
                time: moment(auction.time).format("DD-MM-YYYY HH:mm"),
                bidder: auction?.buyerName,
                price: `${auction?.price
                  .toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`,
              };
            })
          );
          if (!Array.isArray(values[4])) {
            const currentBidder = values[4];
            const nameSplit = currentBidder.fullName.split(" ");
            currentBidder.fullName = `***${nameSplit[nameSplit.length - 1]}`;
            setCurrentBidder(currentBidder);
          } else {
            setCurrentBidder({});
          }
        });

        const currentCategory = await getById(productRes.categoryID);

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
            setTimeRemaining(`${hours} hours left`);
          }
        } else {
          if (hours === 0) {
            setTimeRemaining(`${minutes} minutes left`);
          } else {
            setTimeRemaining(`${hours} hours left`);
          }
        }

        const currentSub = currentCategory.subCategory.find(
          (subCategory) => subCategory.id === productRes.subCategoryId
        );

        setBreadcrumb([
          currentCategory.name,
          currentSub.name,
          productRes.title,
        ]);

        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, [productId, user, isReload]);

  const onImageClick = (index) => {
    setCurrentImage(index);
  };

  const onLikeClick = () => {
    if (user) {
      setIsLike(!isLike);
      if (!isLike) {
        addWatch(productId, user?.id);
      } else {
        delWatch(productId, user?.id);
      }
    } else {
      history.push("/login");
    }
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
      setIsReload(!isReload);
    }, 500);
    socket.emit("priceChange", data, (error) => {
      if (error) {
        console.log("error: ", error);
      }
    });
  };

  const handleAutoAuctionClick = async () => {
    const data = {
      productId: product?.id,
      buyerId: user?.id,
      priceStep: product?.priceStep,
      status: "processing",
    };
    await createAutoAuctionTransaction(data)
      .then((res) => {
        handleAuctionClick();
      })
      .catch((err) => {
        message.error(err.message);
      });
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
    setIsReload(!isReload);
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
                        title="Kết thúc sau"
                        style={{ color: "#919293" }}
                      />
                    </div>
                  </div>
                  <div className={styles.currentGroupValue}>
                    <div className={styles.currentGroupItem}>
                      <Text.h2
                        title={`${product.currentPrice
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
                      />
                    </div>
                    <div className={styles.currentGroupItem}>
                      {product?.status !== "processing" ? (
                        <Text.h3 title={"Đã kết thúc"} />
                      ) : (
                        <Text.h3
                          style={{ color: "red" }}
                          title={timeRemaining}
                        />
                      )}
                    </div>
                  </div>
                </div>{" "}
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
                      title={currentBidder.fullName ? currentBidder.name : ""}
                    />
                    {currentBidder.score && (
                      <Tag className={styles.tag} color="#86b817">
                        <Text.caption title={`${currentBidder.score * 10}%`} />
                      </Tag>
                    )}
                  </div>
                </div>
                <div className={styles.collapsedWrapper}>
                  <Collapse onChange={callback} bordered={false}>
                    <Panel
                      header={<Text.caption title="Mô tả chi tiết" />}
                      key="1"
                    >
                      <Text.caption title={product.description} />
                    </Panel>
                    <Panel
                      header={
                        <Text.caption
                          title={`Lịch sử đấu giá (${histories.length} lượt)`}
                        />
                      }
                      key="2"
                    >
                      <Table columns={columnsTable} dataSource={histories} />
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
                      <Text.bodyHighlight title={currentSeller.fullName} />
                      <Tag className={styles.tag} color="#86b817">
                        <Text.caption title={`${currentSeller.score * 10}%`} />
                      </Tag>
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <Button
                      className={styles.auction}
                      disabled={
                        product?.isAllUser
                          ? false
                          : (user?.score < 80 && user?.score === undefined) ||
                            user?.id == undefined ||
                            user?.id === product?.ownerId ||
                            product?.status !== "processing" ||
                            product.currentPrice === 0 ||
                            product.buyNow == product.currentPrice
                      }
                      onClick={handleAuctionClick}
                    >
                      <Text.bodyHighlight
                        title={`Đấu giá - ${(product?.maxPrice ==
                        product?.currentPrice
                          ? product?.maxPrice
                          : product?.currentPrice + product?.priceStep
                        )
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
                      />
                    </Button>
                    <Button
                      className={styles.buyNow}
                      disabled={
                        product?.isAllUser
                          ? false
                          : (user?.score < 80 && user?.score === undefined) ||
                            user?.id == undefined ||
                            user?.id === product?.ownerId ||
                            product?.status !== "processing" ||
                            product.currentPrice === 0 ||
                            product.buyNow == product.currentPrice
                      }
                      onClick={handleBuyClick}
                    >
                      <Text.bodyHighlight
                        title={`Mua ngay - ${product.maxPrice
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}đ`}
                      />
                    </Button>
                    <Button
                      className={styles.autoAuction}
                      disabled={
                        product?.isAllUser
                          ? false
                          : (user?.score < 80 && user?.score === undefined) ||
                            user?.id == undefined ||
                            user?.id === product?.ownerId ||
                            product?.status !== "processing" ||
                            product.currentPrice === 0 ||
                            product.buyNow == product.currentPrice
                      }
                      onClick={handleAutoAuctionClick}
                    >
                      <Text.bodyHighlight title="Đấu giá tự động" />
                    </Button>
                    <Button
                      disabled={
                        product?.isAllUser
                          ? false
                          : (user?.score < 80 && user?.score === undefined) ||
                            user?.id == undefined ||
                            user?.id === product?.ownerId ||
                            product?.status !== "processing" ||
                            product.currentPrice === 0 ||
                            product.buyNow == product.currentPrice
                      }
                      onClick={() => onLikeClick()}
                      icon={<HeartOutlined />}
                      className={isLike ? styles.liked : styles.like}
                    >
                      <Text.bodyHighlight
                        title={isLike ? "Đã Yêu thích" : `Yêu thích`}
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
                        title={`${moment(product.postingDate).format(
                          "DD-MM-YYYY HH:mm"
                        )}`}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.silderWrapper} style={{ marginTop: "50px" }}>
            <SlideProduct
              title="Sản phẩm tương tự"
              products={productsTheSame}
            />
          </div>
        </div>
      )}
    </div>
  );
}
