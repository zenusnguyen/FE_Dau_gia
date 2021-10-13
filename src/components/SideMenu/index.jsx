import React, { useState } from "react";
import { Menu } from "antd";
import {
  MailOutlined,
  UserOutlined,
  StarOutlined,
  HeartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;

export default function SideMenu() {
  const [current, setCurrent] = useState("");
  const handleClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
      <Menu
        onClick={handleClick}
        style={{ width: 256 }}
        defaultSelectedKeys={["1"]}
        mode="inline"
      >
        <Menu.Item key="1" icon={<UserOutlined />}>
          Thông tin tài khoản
        </Menu.Item>
        <Menu.Item key="2" icon={<StarOutlined />}>
          Điểm đánh giá
        </Menu.Item>

        <SubMenu key="sub1" icon={<MailOutlined />} title="Quản lý sản phẩm">
          <Menu.Item key="3">Thêm sản phẩm</Menu.Item>
          <Menu.Item key="4">Tôi đăng bán</Menu.Item>
          <Menu.Item key="5">tôi đấu giá</Menu.Item>
        </SubMenu>
        <Menu.Item icon={<HeartOutlined />} key="6">
          Danh sách yêu thích
        </Menu.Item>
        <Menu.Item icon={<LogoutOutlined />} key="7">
          Đăng xuất
        </Menu.Item>
      </Menu>
  );
}
