import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import styles from "./styles.module.css";
import SalePage from "../SalePage";
import AuctionPage from "../AuctionPage";
import LikePage from "../LikePage";
import InfoAccountPage from "../InfoAccountPage";
import EvaluatePage from "../EvaluatePage";
import AddProductPage from "../AddProductPage";
import LoadingPage from "../LoadingPage";
import { Breadcrumb } from "antd";
import Text from "../../components/Text";

export default function ProfileManagement() {
  const { page } = useParams();
  const [currentKey, setCurrentKey] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    if (page === "like-list") {
      setCurrentKey("8");
      setBreadcrumb(["Danh sách yêu thích"]);
    } else if (page === "auction") {
      setCurrentKey("7");
      setBreadcrumb(["Quản lý sản phẩm", "Tôi đấu giá"]);
    }
    setIsLoading(false);
  }, [page]);

  const renderComponent = () => {
    switch (currentKey) {
      case "1":
        return <InfoAccountPage />;
      case "2":
        return <EvaluatePage />;
      case "5":
        return <AddProductPage />;
      case "6":
        return <SalePage></SalePage>;
      case "7":
        return <AuctionPage></AuctionPage>;
      case "8":
        return <LikePage></LikePage>;
      default:
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumb style={{ marginBottom: "30px" }}>
        <Breadcrumb.Item>
          <Text.caption title="Trang chủ" />
        </Breadcrumb.Item>
        {breadcrumb.map((item) => (
          <Breadcrumb.Item>
            <Text.caption title={item} />
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className={styles.content}>
          <SideMenu
            handleClick={setCurrentKey}
            currentKey={currentKey}
            updateBreadcrumb={setBreadcrumb}
          ></SideMenu>
          {renderComponent()}
        </div>
      )}
    </div>
  );
}
