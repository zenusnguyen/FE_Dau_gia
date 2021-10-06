/* eslint-disable react/jsx-pascal-case */
import React from "react";
import styles from "./styles.module.css";
import { Breadcrumb, Image, Divider, Tag, Collapse, Button } from "antd";
import Text from "../../components/Text";
import { Colors } from "../../components/Color";
import ProductImage from "../../assets/product.svg";
import SlideProduct from "../../components/SlideProduct";
import { HeartOutlined } from "@ant-design/icons";

const products = [
  {
    id: "1",
    title: "Taylor Swift - Frealess",
    description: "(Taylor's Version) (Metallic...",
    price: "1.250.000đ",
    view: "20",
    timming: "12d 8h 5m",
    src: ProductImage,
    width: 240,
  },
  {
    id: "2",
    title: "Taylor Swift - Frealess",
    description: "(Taylor's Version) (Metallic...",
    price: "1.250.000đ",
    view: "20",
    timming: "12d 8h 5m",
    src: ProductImage,
    width: 240,
  },
  {
    id: "3",
    title: "Taylor Swift - Frealess",
    description: "(Taylor's Version) (Metallic...",
    price: "1.250.000đ",
    view: "20",
    timming: "12d 8h 5m",
    src: ProductImage,
    width: 240,
  },
  {
    id: "4",
    title: "Taylor Swift - Frealess",
    description: "(Taylor's Version) (Metallic...",
    price: "1.250.000đ",
    view: "20",
    timming: "12d 8h 5m",
    src: ProductImage,
    width: 240,
  },
  {
    id: "5",
    title: "Taylor Swift - Frealess",
    description: "(Taylor's Version) (Metallic...",
    price: "1.250.000đ",
    view: "20",
    timming: "12d 8h 5m",
    src: ProductImage,
    width: 240,
  },
];
const DATA = {
  id: "1",
  title:
    "Taylor Swift - Fearless (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
  description: `"Fearless was an album full of magic and curiosity, the bliss and devastation of youth. It was the diary of the adventures and explorations of a teenage girl who was learning tiny lessons with every new crack in the facade of the fairytale ending she'd been shown in the movies. I'm thrilled to tell you that my new version of Fearless is done and will be with you soon. It's called Fearless (Taylor's Version) and it includes 26 songs." - Taylor Swift. Includes 6 unreleased tracks. Gold 3 LP.`,
  price: "1.250.000đ",
  view: "20",
  timming: "12d 8h 5m",
  images: [ProductImage, ProductImage, ProductImage, ProductImage],
  width: 240,
  history: [
    {
      time: "01/10/2021",
      buyer: "Anh Nguyen",
      price: " 12500000d",
    },
    {
      time: "01/10/2021",
      buyer: "Anh Nguyen",
      price: " 12500000d",
    },
    {
      time: "01/10/2021",
      buyer: "Anh Nguyen",
      price: " 12500000d",
    },
  ],
};

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const { Panel } = Collapse;

export default function ItemDetailPage({ data }) {
  const SubImage = ({ src }) => {
    return <Image className={styles.subImage} src={src} width={80}></Image>;
  };

  function callback(key) {
    console.log(key);
  }
  const { images = [], title, description, price, timming } = DATA;
  return (
    <div className={styles.container}>
      <div className={styles.itemWrapper}>
        <div className={styles.imageGroup}>
          <div className={styles.subImageGroup}>
            {images.map((image, index) => {
              return <SubImage key={index.toString()} src={image}></SubImage>;
            })}
          </div>
        </div>
        <div className={styles.itemDetail}>
          <Image
            className={styles.mainImage}
            src={images[0]}
            width={400}
          ></Image>
          <div className={styles.itemDescription}>
            <Text.h2 title={title}></Text.h2>
            <Divider></Divider>
            <div className={styles.priceTimming}>
              <div>
                <Text.caption title="Gíá hiện tại"></Text.caption>
                <Text.h2 title={price}></Text.h2>
              </div>
              <div>
                <Text.caption title="Kết thức sau"></Text.caption>
                <Text.h3
                  style={{ color: Colors.red }}
                  title={timming}
                ></Text.h3>
              </div>
            </div>
            <Text.caption title="Người đặt giá cao nhất"></Text.caption>
            <div className={styles.topAuction}>
              <Text.caption title="Viet Anh"></Text.caption>
              <Tag className={styles.tag} color="#87d068">
                80%
              </Tag>
            </div>
            <div className={styles.collapsedWrapper}>
              <Collapse
                // defaultActiveKey={["1"]}
                onChange={callback}
              >
                <Panel header="This is panel header 1" key="1">
                  <p>{text}</p>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                  <p>{text}</p>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                  <p>{text}</p>
                </Panel>
              </Collapse>
            </div>
          </div>
          <div className={styles.rightGroup}>
            <div className={styles.seller}>
              <Text.caption title="Người bán"></Text.caption>
              <div className={styles.topAuction}>
                <Text.caption title="Viet Anh"></Text.caption>
                <Tag className={styles.tag} color="#87d068">
                  80%
                </Tag>
              </div>
              <div className={styles.buttonGroup}>
                <Button className={styles.auction}>Đấu giá - xxxxxxx </Button>
                <Button className={styles.buyNow}> Mua ngay - xxxxxxx </Button>
                <Button className={styles.autoAuction}>Đấu giá tự động </Button>
                <Button icon={<HeartOutlined />} className={styles.like}>
                  Yêu thích
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.silderWrapper}>
        <SlideProduct title="Sản phẩm tương tự" products={products} />
      </div>
    </div>
  );
}
