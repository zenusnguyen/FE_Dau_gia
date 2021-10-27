import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import CategoryItem from "../CategoryItem";
import Text from "../Text/";
import { BACKEND_DOMAIN } from "../../constants";

export default function CategoryList(props) {
   const { title, categories } = props;

   return (
      <div className={styles.categoryList}>
         <div className={styles.title}>
            <Text.h3 title={title} />
         </div>
         <ul className={styles.list}>
            {categories.map((category) => (
               <li className={styles.item} key={category.id}>
                  <Link to={`/category/${category.id}`}>
                     <CategoryItem
                        title={category.name}
                        src={`${BACKEND_DOMAIN}${category.image.src}`}
                     />
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
}
