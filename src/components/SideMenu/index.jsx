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

export default function SideMenu({ handleClick, currentKey }) {
   console.log(currentKey);
   const onChangeKey = (e) => {
      console.log("e: ", e);
      handleClick(e.key);
   };
   return (
      <Menu
         onClick={onChangeKey}
         style={{ width: 256, minHeight: "60vh" }}
         defaultSelectedKeys={[currentKey]}
         mode="inline"
         //openKeys={[currentKey]}
      >
         <Menu.Item key="1" icon={<UserOutlined />}>
            Thông tin tài khoản
         </Menu.Item>
         <Menu.Item key="2" icon={<StarOutlined />}>
            Điểm đánh giá
         </Menu.Item>
         <SubMenu key="4" icon={<MailOutlined />} title="Quản lý sản phẩm">
            <Menu.Item key="5">Thêm sản phẩm</Menu.Item>
            <Menu.Item key="6">Tôi đăng bán</Menu.Item>
            <Menu.Item key="7">Tôi đấu giá</Menu.Item>
         </SubMenu>
         <Menu.Item icon={<HeartOutlined />} key="8">
            Danh sách yêu thích
         </Menu.Item>
         <Menu.Item icon={<LogoutOutlined />} key="9">
            Đăng xuất
         </Menu.Item>
      </Menu>
   );
}
