import React, { useState } from "react";
import { Menu } from "antd";
import Text from "../Text";
import {
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ShopOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;

export default function SideMenu({
  handleClick,
  currentKey,
  updateBreadcrumb,
}) {
  const onChangeKey = (e) => {
    if (e.key === "1") {
      updateBreadcrumb(["Quản lý danh mục"]);
    } else if (e.key === "2") {
      updateBreadcrumb(["Điểm đánh giá"]);
    } else if (e.key === "4") {
      updateBreadcrumb(["Quản lý người dùng", "Thêm người dùng"]);
    } else if (e.key === "5") {
      updateBreadcrumb(["Quản lý người dùng", "Tất cả người dùng"]);
    } else if (e.key === "6") {
      updateBreadcrumb(["Quản lý sản phẩm", "Tôi đăng bán"]);
    } else if (e.key === "7") {
      updateBreadcrumb(["Quản lý sản phẩm", "Tôi đấu giá"]);
    } else if (e.key === "8") {
      updateBreadcrumb(["Danh sách yêu thích"]);
    }
    handleClick(e.key);
  };
  return (
    <Menu
      onClick={onChangeKey}
      style={{ width: 250, minHeight: "60vh" }}
      defaultSelectedKeys={[currentKey]}
      mode="inline"
    >
      <Menu.Item key="1" icon={<AppstoreOutlined />}>
        <Text.caption title="Quản lý danh mục" />
      </Menu.Item>
      <Menu.Item key="2" icon={<ShopOutlined />}>
        <Text.caption title="Quản lý sản phẩm" />
      </Menu.Item>
      <SubMenu
        key="3"
        icon={<UserOutlined />}
        title={<Text.caption title="Quản lý người dùng" />}
      >
        <Menu.Item key="4">
          <Text.caption title="Thêm người dùng" />
        </Menu.Item>
        <Menu.Item key="5">
          <Text.caption title="Tất cả người dùng" />
        </Menu.Item>
      </SubMenu>
      <Menu.Item icon={<LogoutOutlined />} key="6">
        <Text.caption title="Đăng xuất" />
      </Menu.Item>
    </Menu>
  );
}
