/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Button, Image, Cascader, Dropdown, Menu } from "antd";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../assets/Brand.png";
import styles from "./styles.module.css";
import "./style.css";
import Search from "../SearchBar";
import { SmileOutlined, ShoppingOutlined } from "@ant-design/icons";
import Text from "../Text";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/userActions";
import { isLogin } from "../../utilities/isLogin";
import { getAll as getAllCategory } from "../../services/categoryApi";

export default function Header(props) {
   const [categoryOptions, setCategoryOptions] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const { user } = useSelector((state) => state.user);
   const dispatch = useDispatch();
   const history = useHistory();

   useEffect(() => {
      const fetchData = async () => {
         const allCategory = await getAllCategory();
         const options = allCategory.map((category) => {
            return {
               value: category.id,
               label: category.name,
               children: category.subCategory.map((sub) => {
                  return { value: sub.id, label: sub.name };
               }),
            };
         });
         setCategoryOptions(options);
         setIsLoading(false);
      };
      fetchData();
   }, []);

   function onChange(value) {
      history.push(`/category/${value[0]}/sub/${value[1]}/page/1`);
   }

   function onSearch(keyWord) {
      history.push(`/search/${keyWord}/page/1`);
   }

   const menu = (
      <Menu>
         <Menu.Item>
            <a target="_blank">
               <Text.caption title="Thông tin tài khoản" />
            </a>
         </Menu.Item>
         <Menu.Item>
            <Link to="/">
               <Text.caption title="Quản lý sản phẩm" />
            </Link>
         </Menu.Item>
         <Menu.Item>
            <Link to="/profile/like-list">
               <Text.caption title="Danh sách yêu thích" />
            </Link>
         </Menu.Item>
         <Menu.Item>
            <a
               onClick={() => {
                  console.log("??");
                  dispatch(logout());
               }}
               target="_blank"
            >
               <Text.caption title="Đăng xuất" />
            </a>
         </Menu.Item>
      </Menu>
   );

   return (
      <div>
         {!isLoading && (
            <div className={styles.headerContainer}>
               <Link to="/">
                  <Image preview={false} src={Logo}></Image>
               </Link>
               <div className="cascader">
                  <div className={styles.cascaderLabel}>
                     <Text.bodyHighlight title="Danh mục" />
                     <br />
                     <Text.bodyHighlight title="sản phẩm" />
                  </div>
                  <Cascader
                     options={categoryOptions}
                     onChange={onChange}
                     className={styles.cascader}
                     style={{ color: "#333" }}
                  />
               </div>
               <div className={styles.search}>
                  <Search onSearch={onSearch}></Search>
               </div>
               {isLogin ? (
                  <Dropdown overlay={menu} placement="bottomLeft" arrow>
                     <Button
                        style={{
                           border: "none",
                           display: "flex",
                           alignItems: "center",
                        }}
                     >
                        <SmileOutlined style={{ fontSize: "35px" }} />
                        <Text.caption title={user.name} />
                     </Button>
                  </Dropdown>
               ) : (
                  <div className={styles.login}>
                     <SmileOutlined
                        style={{ fontSize: "35px", marginRight: "10px" }}
                     />
                     <Link to="/login" style={{ color: "#333" }}>
                        <Text.caption title="Đăng nhập" />
                     </Link>
                     <Text.caption title="/" />
                     <Link to="/register" style={{ color: "#333" }}>
                        <Text.caption title="Tạo tài khoản" />
                     </Link>
                  </div>
               )}
               <Button
                  style={{
                     border: "none",
                     display: "flex",
                     alignItems: "center",
                  }}
               >
                  <ShoppingOutlined style={{ fontSize: "27px" }} />
                  <Text.caption title="0 Sản phẩm" />
               </Button>
            </div>
         )}
      </div>
   );
}
