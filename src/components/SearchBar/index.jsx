import React from "react";
import { Input } from "antd";
import styles from "./styles.module.css";

const { Search } = Input;

export default function index(props) {
  const { placeholder, onSearch } = props;
  return (
    <div className={styles.searchContainer}>
      <Search
        placeholder={placeholder || "Hãy nhập từ khoá"}
        allowClear
        enterButton="Tiềm kiếm"
        size="large"
        onSearch={onSearch}
      ></Search>
    </div>
  );
}
