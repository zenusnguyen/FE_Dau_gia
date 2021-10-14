import React, { useState } from "react";
import SideMenu from "../../components/SideMenu";
import styles from "./styles.module.css";
import ProductManagement from "../ProductManagement";

export default function ProfileManagement() {
  const [currentKey, setCurrentKey] = useState("4");

  const renderComponent = () => {
    switch (currentKey) {
      case "1":
        // code block
        break;
      case "2":
        // code block
        break;
      case "3":
        // code block
        break;
      case "6":
        return <ProductManagement></ProductManagement>;
        break;
      default:
      // code block
    }
  };

  return (
    <div className={styles.container}>
      <SideMenu handleClick={setCurrentKey}></SideMenu>
      {renderComponent()}
    </div>
  );
}
