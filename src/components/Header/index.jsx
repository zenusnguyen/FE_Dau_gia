/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Button, Image, Cascader, Dropdown, Menu } from "antd";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../assets/Brand.png";
import styles from "./styles.module.css";
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
  console.log("user: ", user);

  useEffect(() => {
    const fetchData = async () => {
      const allCategory = await getAllCategory();
      const options = allCategory
        .filter((category) => {
          if (category.subCategory) {
            return true;
          }
          return false;
        })
        .map((category) => {
          return {
            value: category.id,
            label: <Text.caption title={category.name} />,
            children: category.subCategory?.map((sub) => {
              return {
                value: sub.id,
                label: <Text.caption title={sub.name} />,
              };
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
        <Link to={`/profile/${user?.user?.id}`}>
          <Text.caption title="Thông tin tài khoản" />
        </Link>
      </Menu.Item>
      <Menu.Item hidden={user?.user?.appRole !== "admin"}>
        <Link to={`/admin/manage/`}>
          <Text.caption title="Quản trị" />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => dispatch(logout())}>
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
          <div className={styles.cascaderContainer}>
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
              placeholder=""
              allowClear={false}
            />
          </div>
          <div className={styles.search}>
            <Search onSearch={onSearch}></Search>
          </div>
          {Object.keys(user).length !== 0 ? (
            <Dropdown overlay={menu} placement="bottomLeft" arrow>
              <Button
                style={{
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SmileOutlined style={{ fontSize: "35px" }} />
                <Text.caption title={user?.user?.username} />
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
