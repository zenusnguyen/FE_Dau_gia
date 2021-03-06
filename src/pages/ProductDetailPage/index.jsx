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
  Modal,
  message,
  Input,
  InputNumber,
} from "antd";
import Text from "../../components/Text";
import SlideProduct from "../../components/SlideProduct";
import { HeartOutlined } from "@ant-design/icons";
import {
  get,
  getAllHistory,
  getTheSame,
  updateProduct,
} from "../../services/productApi";
import { getById } from "../../services/categoryApi";
import { getByBidder as getWatchByBidder } from "../../services/wathApi";
import { getById as getUserById } from "../../services/userApi";
import { add as addWatch, del as delWatch } from "../../services/wathApi";
import {
  getLastBidder,
  getAllByProduct,
  deletePriceHistory,
} from "../../services/priceHistoryApi";
import moment from "moment";
import { BACKEND_DOMAIN } from "../../constants";
import { Table } from "antd";
import { useSelector } from "react-redux";
import LoadingPage from "../LoadingPage";
import ReactHtmlParser from "react-html-parser";
import { createAuctionTransaction } from "../../services/priceHistoryApi";
import { createAutoAuctionTransaction } from "../../services/autoAuction";
import { socket } from "../../services/socket";
import {
  sendPreBidderNotification,
  sendBidderNotification,
  sendSellerNotification,
  sendAuctionSuccessNotification,
  sendRejectNotification,
} from "../../services/email";
import TimeCount from "../../components/TimeCount";
import { getByUser } from "../../services/evaluateApi";
const { Panel } = Collapse;

export default function ItemDetailPage({ data }) {
  const { user } = useSelector((state) => state.user?.user);
  console.log("user: ", user);
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
  const [isModalBuyVisible, setIsModalBuyVisible] = useState(false);
  const [isModalAuctionVisible, setIsModalAuctionVisible] = useState(false);
  const [isModalReview, setIsModalReview] = useState(false);
  const [isEndTime, setIsEndTime] = useState(false);

  const [maxAutoPrice, setMaxAutoPrice] = useState();
  const [isModalAutoAuctionVisible, setIsModalAutoAuctionVisible] =
    useState(false);
  const [evaluates, setEvaluates] = useState([]);
  const [currentSelectedRow, setCurrentSelectedRow] = useState({});
  useEffect(() => {
    const fetchReview = async () => {
      await getByUser(currentSelectedRow?.buyerId).then((values) => {
        const data = values.map((value, i) => {
          return {
            key: i,
            assessor: value.senderName,
            time: moment(value.time).format("DD-MM-YYYY HH:mm"),
            score: value.score > 0 ? "+1" : "-1",
            review: value.content,
          };
        });
        setEvaluates(data);
      });
    };
    fetchReview();
  }, [currentSelectedRow]);

  socket.on("priceChange", async ({ data }) => {
    if (data !== undefined && data?.productId == product?.id) {
      setProduct({ ...product, currentPrice: data?.price });
      // const historyList = await getAllHistory(productId);
      // setHistories(
      //   historyList.map((auction, i) => {
      //     return {
      //       buyerId: auction?.buyer,
      //       key: i.toString(),
      //       time: moment(auction.time).format("DD-MM-YYYY HH:mm"),
      //       bidder: auction?.buyerName,
      //       price: `${auction?.price
      //         .toString()
      //         .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`,aaaaa
      //     };
      //   })
      // );
    }
  });
  const columns = [
    {
      title: "Th???i gian",
      dataIndex: "time",
      width: "158px",
    },
    {
      title: "Ng?????i ????nh gi??",
      dataIndex: "assessor",
      width: "150px",
    },
    {
      title: "??i???m",
      dataIndex: "score",
      width: "60px",
    },
    {
      title: "Nh???n x??t",
      dataIndex: "review",
    },
  ];

  const handleReject = async (data) => {
    const black =
      product?.blackList !== undefined
        ? [...product?.blackList, data?.buyerId]
        : [data?.buyerId];
    await updateProduct(product?.id, {
      blackList: black,
    })
      .then(async (res) => {
        const bidderHistory = histories.filter(
          (el) => el?.buyerId === data?.buyerId
        );

        // delete history
        Promise.all(
          bidderHistory?.map(async (el) => {
            await deletePriceHistory(el?.id);
          })
        );
        //update product

        const newHistory = histories.filter(
          (el) => el?.buyerId !== data?.buyerId
        );

        await updateProduct(product?.id, {
          currentBidderId: newHistory[0]?.buyerId || null,
          currentPrice:
            newHistory[0]?.price || product?.currentPrice - product?.priceStep,
        });
        // sendEmailReject

        const bidder = await getUserById(data?.buyerId);
        await sendRejectNotification({
          email: bidder?.email,
          product: product,
        });
        message.success("Thao t??c th??nh c??ng");
        setIsReload(!isReload);
      })
      .catch((err) => {
        message.error("Thao t??c th???t b???i");
      });
  };
  const columnsTable = [
    {
      title: "Th???i gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Ng?????i mua",
      dataIndex: "bidder",
      key: "bidder",
    },
    {
      title: "Gi??",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "H??nh ?????ng",
      dataIndex: "price",
      key: "price",
      render: (_, values) => {
        console.log("values: ", values);
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <div className={styles.action}>
            {product?.ownerId === user?.id ? (
              <a
                onClick={() => {
                  handleReject(values);
                }}
              >
                T??? ch???i
              </a>
            ) : (
              <div></div>
            )}
            <a
              onClick={() => {
                setCurrentSelectedRow(values);
                setIsModalReview(true);
              }}
            >
              Xem ????nh gi??
            </a>
          </div>
        );
      },
    },
  ];
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
    get(productId).then((product) => {
      updateProduct(productId, { view: product.view + 1 });
    });
  }, [productId]);

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
                id: auction.id,
                buyerId: auction?.buyer,
                key: i.toString(),
                time: moment(auction.time).format("DD-MM-YYYY HH:mm"),
                bidder: auction?.buyerName,
                price: `${auction?.price
                  .toString()
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`,
              };
            })
          );
          if (!Array.isArray(values[4])) {
            const currentBidder = values[4];
            // const nameSplit = currentBidder.username.split(" ");
            console.log("currentBidder.username: ", currentBidder.username);
            currentBidder.username = `${currentBidder.username.substr(
              1,
              3
            )}***`;

            setCurrentBidder(currentBidder);
          } else {
            setCurrentBidder({});
          }
        });

        const currentCategory = await getById(productRes.categoryID);

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

  const onOkAuction = () => {
    handleAuctionClick();
    setIsModalAuctionVisible(false);
  };

  const onOkBuy = () => {
    handleBuyClick();
    setIsModalBuyVisible(false);
  };

  const onOkAuto = () => {
    handleAutoAuctionClick();
    setIsModalAutoAuctionVisible(false);
  };

  const handleChangeMaxPrice = (e) => {
    console.log("e: ", e.target.value);
  };

  const handleAuctionClick = async () => {
    await updateProduct(product?.id, { currentBidderId: user.id });

    const data = {
      time: Date.now(),
      price: product?.currentPrice + product?.priceStep,
      buyer: user?.id,
      bidderId: product?.ownerId,
      productId: product?.id,
      buyerName: user?.username,
      type: "auction",
      maxPrice: product?.maxPrice,
    };
    if (product?.currentPrice + product?.priceStep === product.maxPrice) {
      await handleBuyClick();
    } else {
      await sendBidderNotification({ product, bidder: user?.email }).catch(
        (err) => {
          console.log("err: ", err);
        }
      );

      await getUserById(product?.ownerId).then(async (res) => {
        await sendSellerNotification({
          product,
          seller: res?.email,
        }).catch((err) => {
          console.log("err: ", err);
        });
      });
      if (histories[0]?.buyerId !== undefined) {
        await getUserById(histories[0]?.buyerId).then(async (res) => {
          if (res?.email !== undefined) {
            await sendPreBidderNotification({
              product,
              preBidder: res?.email,
            }).catch((err) => {
              console.log("err: ", err);
            });
          }
        });
      }

      await createAuctionTransaction(data)
        .then(async (res) => {
          message.success("?????u gi?? th??nh c??ng");
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    setTimeout(() => {
      setIsReload(!isReload);
    }, 1000);
    socket.emit("priceChange", data, (error) => {
      if (error) {
        console.log("error: ", error);
      }
    });
  };

  const handleAutoAuctionClick = async () => {
    console.log("maxAutoPrice: ", maxAutoPrice);
    if (!maxAutoPrice || maxAutoPrice < product.currentPrice) {
      message.error("Gi?? nh???p v??o kh??ng ????ng !");
    } else {
      const data = {
        productId: product?.id,
        buyerId: user?.id,
        priceStep: product?.priceStep,
        status: "processing",
        maxPrice: maxAutoPrice,
      };
      await createAutoAuctionTransaction(data)
        .then((res) => {
          handleAuctionClick();
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  const handleBuyClick = async () => {
    await updateProduct(product?.id, { currentBidderId: user.id });
    const data = {
      time: Date.now(),
      price: product?.maxPrice,
      buyer: user?.id,
      bidderId: product?.ownerId,
      productId: product?.id,
      buyerName: user?.username,
      type: "buy",
    };
    if (product?.ownerId !== undefined) {
      await getUserById(product?.ownerId).then(async (res) => {
        await sendAuctionSuccessNotification({
          product,
          email: res?.email,
        }).catch((err) => {
          console.log("err: ", err);
        });
      });
    }
    if (histories[0]?.buyerId !== undefined) {
      await getUserById(histories[0]?.buyerId).then(async (res) => {
        await sendAuctionSuccessNotification({
          product,
          email: res?.email,
        }).catch((err) => {
          console.log("err: ", err);
        });
      });
    }

    await createAuctionTransaction(data)
      .then((res) => {
        message.success("?????u gi?? th??nh c??ng");
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
              <Text.caption title="Trang chu??" />
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
                        title="G???? hi???n t???i"
                        style={{ color: "#919293" }}
                      />
                    </div>
                    <div className={styles.currentGroupItem}>
                      <Text.caption
                        title="K???t th??c sau"
                        style={{ color: "#919293" }}
                      />
                    </div>
                  </div>
                  <div className={styles.currentGroupValue}>
                    <div className={styles.currentGroupItem}>
                      <Text.h2
                        title={`${product.currentPrice
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`}
                      />
                    </div>
                    <div className={styles.currentGroupItem}>
                      {product?.status !== "processing" ? (
                        <Text.h3 title={"???? k???t th??c"} />
                      ) : (
                        <TimeCount
                          productEndTime={product.endTime}
                          callBackTimeEnd={() => setIsEndTime(true)}
                        >
                          <Text.h3 />
                        </TimeCount>
                      )}
                    </div>
                  </div>
                </div>{" "}
                <div className={styles.topAuction}>
                  <Text.caption
                    title="Ng?????i ?????t gi?? cao nh???t"
                    style={{ color: "#919293" }}
                  />
                  <div
                    className={styles.topAuctionConetnt}
                    style={{ marginTop: "5px" }}
                  >
                    <Text.bodyHighlight
                      title={
                        currentBidder.username ? currentBidder.username : ""
                      }
                    />
                    {currentBidder.score && (
                      <Tag className={styles.tag} color="#86b817">
                        <Text.caption title={`${currentBidder.score}%`} />
                      </Tag>
                    )}
                  </div>
                </div>
                <div className={styles.collapsedWrapper}>
                  <Collapse onChange={callback} bordered={false}>
                    <Panel
                      header={<Text.caption title="M?? t??? chi ti???t" />}
                      key="1"
                    >
                      <div>{ReactHtmlParser(product.description)}</div>
                    </Panel>
                    <Panel
                      header={
                        <Text.caption
                          title={`L???ch s??? ?????u gi?? (${histories.length} l?????t)`}
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
                      title="Ng?????i b??n"
                      style={{
                        color: "#919293",
                        marginBottom: "4px",
                      }}
                    />

                    <div className={styles.topAuction}>
                      <Text.bodyHighlight title={currentSeller.username} />
                      <Tag className={styles.tag} color="#86b817">
                        <Text.caption title={`${currentSeller.score}%`} />
                      </Tag>
                      <a
                        onClick={() => {
                          setCurrentSelectedRow({
                            buyerId: user?.user?.id,
                          });
                          setIsModalReview(true);
                        }}
                      >
                        Xem ????nh gi??
                      </a>
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <Button
                      className={styles.auction}
                      disabled={
                        user?.id == undefined ||
                        user?.id === product?.ownerId ||
                        product?.status !== "processing" ||
                        product.currentPrice === 0 ||
                        product.buyNow == product.currentPrice ||
                        isEndTime
                      }
                      onClick={() => setIsModalAuctionVisible(true)}
                    >
                      <Text.bodyHighlight
                        style={{
                          color: isEndTime ? "#505050" : "#fff",
                        }}
                        title={`??????u gia?? - ${(product?.maxPrice ==
                        product?.currentPrice
                          ? product?.maxPrice
                          : product?.currentPrice + product?.priceStep
                        )
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`}
                      />
                    </Button>
                    <Button
                      className={styles.buyNow}
                      disabled={
                        user?.id == undefined ||
                        user?.id === product?.ownerId ||
                        product?.status !== "processing" ||
                        product.currentPrice === 0 ||
                        product.buyNow == product.currentPrice ||
                        isEndTime
                      }
                      onClick={() => setIsModalBuyVisible(true)}
                    >
                      <Text.bodyHighlight
                        style={{
                          color: isEndTime ? "#505050" : "#fff",
                        }}
                        title={`Mua ngay - ${product.maxPrice
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}??`}
                      />
                    </Button>
                    <Button
                      className={styles.autoAuction}
                      disabled={
                        user?.id == undefined ||
                        user?.id === product?.ownerId ||
                        product?.status !== "processing" ||
                        product.currentPrice === 0 ||
                        product.buyNow == product.currentPrice ||
                        isEndTime
                      }
                      onClick={() => {
                        setIsModalAutoAuctionVisible(true);
                      }}
                    >
                      <Text.bodyHighlight
                        title="?????u gi?? t??? ?????ng"
                        style={{
                          color: isEndTime ? "#505050" : "#fff",
                        }}
                      />
                    </Button>
                    <Button
                      disabled={
                        user?.id == undefined ||
                        user?.id === product?.ownerId ||
                        product?.status !== "processing" ||
                        product.currentPrice === 0 ||
                        product.buyNow == product.currentPrice ||
                        isEndTime
                      }
                      onClick={() => onLikeClick()}
                      icon={<HeartOutlined />}
                      className={isLike ? styles.liked : styles.like}
                    >
                      <Text.bodyHighlight
                        title={isLike ? "???? Y??u th??ch" : `Y??u thi??ch`}
                      />
                    </Button>
                  </div>
                  <div className={styles.postingDate}>
                    <Text.caption
                      title="Sa??n ph????m ????????c ????ng ta??i nga??y"
                      style={{
                        color: "#919293",
                      }}
                    />
                    <p style={{ marginTop: "6px" }}>
                      <Text.bodyHighlight
                        title={`${moment(product.createdAt).format(
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
              title="S???n ph???m t????ng t???"
              products={productsTheSame}
            />
          </div>
        </div>
      )}

      <Modal
        title={<Text.bodyHighlight title="X??c nh???n mua h??ng" />}
        visible={isModalBuyVisible}
        onOk={() => onOkBuy()}
        onCancel={() => setIsModalBuyVisible(false)}
        okText={<Text.caption title="?????ng ??" />}
        cancelText={<Text.caption title="H???y" />}
      >
        {product.maxPrice && (
          <Text.caption
            title={`B???n s??? mua m???t h??ng n??y v???i gi?? ${product.maxPrice
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}???`}
          />
        )}
      </Modal>
      <Modal
        title={<Text.bodyHighlight title="X??c nh???n ra gi??" />}
        visible={isModalAuctionVisible}
        onOk={() => onOkAuction()}
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
        title={<Text.bodyHighlight title="X??c nh???n t??? ?????ng ra gi??" />}
        visible={isModalAutoAuctionVisible}
        onOk={() => onOkAuto()}
        onCancel={() => setIsModalAutoAuctionVisible(false)}
        okText={<Text.caption title="?????ng ??" />}
        cancelText={<Text.caption title="H???y" />}
      >
        <Text.caption title={`Nh???p gi?? t???i ??a `} />
        <Input
          onChange={(e) => {
            console.log("e?.target?.value): ", e?.target?.value);
            setMaxAutoPrice(e?.target?.value);
          }}
          placeholder="1000.000??"
          style={{ width: "180px" }}
        ></Input>
      </Modal>
      <Modal
        title={<Text.bodyHighlight title="????nh gi??" />}
        visible={isModalReview}
        onOk={() => setIsModalReview(false)}
        onCancel={() => setIsModalReview(false)}
        // okText={<Text.caption title="?????ng ??" />}
        cancelText={<Text.caption title="H???y" />}
      >
        <Table columns={columns} dataSource={evaluates} />
      </Modal>
    </div>
  );
}
