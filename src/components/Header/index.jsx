import React from "react";
import { Button, Image, Cascader, Dropdown, Menu } from "antd";
import Logo from "../../assets/Brand.png";
import styles from "./styles.module.css";
import Search from "../SearchBar";
import { ShoppingCartOutlined, SmileOutlined } from "@ant-design/icons";
import Text from "../Text";
import { useHistory } from "react-router-dom";

const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

export default function Header(props) {
  function onChange(value) {
    console.log(value);
  }
  const history = useHistory();
  console.log('useHistory(): ', useHistory());
  function handleClick() {
    history.push("/home");
  }

  const isSigned = false;
  return (
    <div className={styles.headerContainer}>
      <Image preview={false} src={Logo}></Image>
      <Cascader
        options={options}
        onChange={onChange}
        placeholder="Please select"
      />

      <Search></Search>

      {isSigned ? (
        <Dropdown overlay={menu} placement="bottomLeft" arrow>
          <Button>anonymous</Button>
        </Dropdown>
      ) : (
        <Button onClick={handleClick} icon={<SmileOutlined></SmileOutlined>}>
          <Text.body title="Đăng nhập"></Text.body>
        </Button>
      )}
      <Button icon={<ShoppingCartOutlined></ShoppingCartOutlined>}>
        0 Sản phẩm
      </Button>
    </div>
  );
}
