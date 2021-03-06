import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import Text from "../Text";
import Item from "../Item";
import styles from "./styles.module.css";

function SampleNextArrow(props) {
   const { onClick } = props;
   return (
      <div className={`${styles.arrow} ${styles.next}`} onClick={onClick}>
         <RightOutlined />
      </div>
   );
}

function SamplePrevArrow(props) {
   const { onClick } = props;
   return (
      <div className={`${styles.arrow} ${styles.prev}`} onClick={onClick}>
         <LeftOutlined />
      </div>
   );
}

export default function ProductSlide(props) {
   const { title, products } = props;
   var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      autoplay: true,
      slidesToShow: products.length > 4 ? 4 : products.length,
      slidesToScroll: 1,
      variableWidth: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
         {
            breakpoint: 1360,
            settings: {
               slidesToShow: products.length > 4 ? 3 : products.length,
            },
         },
         {
            breakpoint: 1035,
            settings: {
               slidesToShow: products.length > 4 ? 2 : products.length,
            },
         },
         {
            breakpoint: 450,
            settings: {
               slidesToShow: products.length > 4 ? 1 : products.length,
               variableWidth: false,
            },
         },
      ],
   };
   return (
      <div className={styles.slide}>
         <div className={styles.title}>
            <Text.h3 title={title} />
         </div>
         <Slider {...settings} className={styles.list}>
            {products.map((product) => (
               <div className={styles.item} key={product.id}>
                  <Link to={`/product/${product.id}`}>
                     <Item product={product} />
                  </Link>
               </div>
            ))}
         </Slider>
      </div>
   );
}
