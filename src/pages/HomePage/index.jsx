import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { socket } from "../../services/socket";
import { Button } from "antd";
import SlideProduct from "../../components/SlideProduct";
import CategoryList from "../../components/CategoryList";
import Smartphone from "../../assets/smartphone.svg";
import Vase from "../../assets/vase.svg";
import EarthGlobe from "../../assets/earth-globe.svg";
import Jacket from "../../assets/jacket.svg";
import ArtBook from "../../assets/art-book.svg";
import ProductImage from "../../assets/product.svg";
import { getAll } from "../../services/productApi";

export default function HomePage() {
  const username = "anh";
  const room = "1";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetch() {
      const data = await getAll();
      console.log("data: ", data);
      setProducts(data);
    }
    fetch();
  }, []);
  //  socket.on("welcome", (data) => {
  //     console.log("data: ", data);
  //  });

  const handleClick = () => {
    // socket.emit("join", { username, room }, (error) => {
    //   if (error) {
    //     alert(error);
    //   }
    // });
  };
  const categories = [
    { id: "1", name: "Điện tử", src: Smartphone },
    { id: "2", name: "Bách hóa", src: Vase },
    { id: "3", name: "Thời trang", src: Jacket },
    { id: "4", name: "Nhà sách", src: ArtBook },
    { id: "5", name: "Quốc tế", src: EarthGlobe },
  ];

  // const products = [
  //   {
  //     id: "1",
  //     title:
  //       "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
  //     price: "1.250.000đ",
  //     view: "20",
  //     timming: "12d 8h 5m",
  //     src: ProductImage,
  //     width: 240,
  //   },
  //   {
  //     id: "2",
  //     title:
  //       "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
  //     price: "1.250.000đ",
  //     view: "20",
  //     timming: "12d 8h 5m",
  //     src: ProductImage,
  //     width: 240,
  //   },
  //   {
  //     id: "3",
  //     title:
  //       "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
  //     price: "1.250.000đ",
  //     view: "20",
  //     timming: "12d 8h 5m",
  //     src: ProductImage,
  //     width: 240,
  //   },
  //   {
  //     id: "4",
  //     title:
  //       "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
  //     price: "1.250.000đ",
  //     view: "20",
  //     timming: "12d 8h 5m",
  //     src: ProductImage,
  //     width: 240,
  //   },
  //   {
  //     id: "5",
  //     title:
  //       "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
  //     price: "1.250.000đ",
  //     view: "20",
  //     timming: "12d 8h 5m",
  //     src: ProductImage,
  //     width: 240,
  //   },
  // ];

  return (
    <div className={styles.homeContainer}>
      <CategoryList title="Danh mục sản phẩm" categories={categories} />
      <SlideProduct title="Sắp kết thúc" products={products} />
      <SlideProduct title="Nhiều lượt ra giá nhất" products={products} />
      <SlideProduct title="Giá cao nhất" products={products} />
      {/* <Button onClick={handleClick}>connect</Button> */}
    </div>
  );
}
