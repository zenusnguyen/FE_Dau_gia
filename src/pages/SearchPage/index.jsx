import React from "react";
import styles from "./styles.module.css";
import { socket } from "../../services/socket";
import { Button, Pagination, Breadcrumb } from "antd";
import Smartphone from "../../assets/smartphone.svg";
import Vase from "../../assets/vase.svg";
import EarthGlobe from "../../assets/earth-globe.svg";
import Jacket from "../../assets/jacket.svg";
import ArtBook from "../../assets/art-book.svg";
import ProductImage from "../../assets/product.svg";
import ProductList from "../../components/ProductList";
import Text from "../../components/Text";

export default function SearchPage() {
   const username = "anh";
   const room = "1";

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

   const products = [
      {
         id: "5",
         title: "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
         price: "1.250.000đ",
         view: "20",
         timming: "12d 8h 5m",
         src: ProductImage,
         width: 240,
         bidder: { name: "***Anh", percent: 80 },
         postingDate: "02/09/2021 10:30",
         auctionMoney: "1.300.000đ",
         buyNow: "1.500.000đ",
      },
      {
         id: "5",
         title: "Taylor Swift - Frealess (Taylor's Version) (Metallic Gold Vinyl) [3LP]",
         price: "1.250.000đ",
         view: "20",
         timming: "12d 8h 5m",
         src: ProductImage,
         width: 240,
         bidder: { name: "***Anh", percent: 80 },
         postingDate: "02/09/2021 10:30",
         auctionMoney: "1.300.000đ",
         buyNow: null,
      },
   ];
   return (
      <div className={styles.searchPage}>
         <div className={styles.searchPageContainer}>
            <div className={styles.content}>
               <Breadcrumb>
                  <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                  <Breadcrumb.Item>
                     <Text.caption title="taylor swift" />
                  </Breadcrumb.Item>
               </Breadcrumb>
               ,
               <div className={styles.contentTop}>
                  <div className={styles.filter}>
                     <Button
                        style={{
                           borderTopRightRadius: "0",
                           borderBottomRightRadius: "0",
                        }}
                     >
                        <Text.caption title="Thời gian kết thúc giảm dần" />
                     </Button>
                     <Button
                        style={{
                           borderTopLeftRadius: "0",
                           borderBottomLeftRadius: "0",
                        }}
                     >
                        <Text.caption title="Giá tăng dần" />
                     </Button>
                  </div>
                  <Pagination defaultCurrent={1} total={50} />
               </div>
               <ProductList products={products} />
               <div className={styles.contentBottom}>
                  <div className={styles.filter}>
                     <Button
                        style={{
                           borderTopRightRadius: "0",
                           borderBottomRightRadius: "0",
                        }}
                     >
                        <Text.caption title="Thời gian kết thúc giảm dần" />
                     </Button>
                     <Button
                        style={{
                           borderTopLeftRadius: "0",
                           borderBottomLeftRadius: "0",
                        }}
                     >
                        <Text.caption title="Giá tăng dần" />
                     </Button>
                  </div>
                  <Pagination defaultCurrent={1} total={50} />
               </div>
            </div>
         </div>
      </div>
   );
}
