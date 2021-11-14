import React, { useState } from "react";
import { Menu } from "antd";
import Text from "../Text";
import {
   UserOutlined,
   StarOutlined,
   HeartOutlined,
   LogoutOutlined,
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
         updateBreadcrumb(["Thông tin tài khoản"]);
      } else if (e.key === "2") {
         updateBreadcrumb(["Điểm đánh giá"]);
      } else if (e.key === "5") {
         updateBreadcrumb(["Quản lý sản phẩm", "Thêm sản phẩm"]);
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
         //openKeys={[currentKey]}
      >
         <Menu.Item key="1" icon={<UserOutlined />}>
            <Text.caption title="Thông tin tài khoản" />
         </Menu.Item>
         <Menu.Item key="2" icon={<StarOutlined />}>
            <Text.caption title="Điểm đánh giá" />
         </Menu.Item>
         <SubMenu
            key="4"
            icon={<ShopOutlined />}
            title={<Text.caption title="Quản lý sản phẩm" />}
         >
            <Menu.Item key="5">
               <Text.caption title="Thêm sản phẩm" />
            </Menu.Item>
            <Menu.Item key="6">
               <Text.caption title="Tôi đăng bán" />
            </Menu.Item>
            <Menu.Item key="7">
               <Text.caption title="Tôi đấu giá" />
            </Menu.Item>
         </SubMenu>
         <Menu.Item icon={<HeartOutlined />} key="8">
            <Text.caption title="Danh sách yêu thích" />
         </Menu.Item>
         <Menu.Item icon={<LogoutOutlined />} key="9">
            <Text.caption title="Đăng xuất" />
         </Menu.Item>
      </Menu>
   );
}
