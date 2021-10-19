/* eslint-disable react/jsx-pascal-case */
import React from "react";
import Text from "../Text";
import { Image, Button, Divider, Badge } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";

export default function ProductItem(props) {
  const {
    id,
    title,
    price,
    timming,
    view,
    src,
    bidder,
    postingDate,
    buyNow,
    auctionMoney,
    status,
  } = props;
  return (
    <div {...props} className={styles.productItemContainer}>
      <div className={styles.productItem}>
        <Image
          width={props?.width || 200}
          src={src}
          alt={title}
          preview={false}
        />
        <div className={styles.info}>
          <div className={styles.name}>
            <Link to={`/product/${id}`} style={{ color: "#333" }}>
              <Text.h3 title={title}></Text.h3>
            </Link>
          </div>
          <Divider style={{ margin: "20px 0" }} />
          <div className={styles.infoCenter}>
            <div className={styles.infoCenterTitle}>
              <div>
                <Text.caption
                  title="Giá hiện tại"
                  style={{ color: "#919293", marginBottom: "4px" }}
                />
              </div>
              <div>
                <Text.caption
                  title="Kết thúc sau"
                  style={{ color: "#919293", marginBottom: "4px" }}
                />
              </div>
            </div>
            <div className={styles.infoCenterValue}>
              <div>
                <Text.h2 title={price} />
              </div>
              <div>
                <Text.h3 title={timming} style={{ color: "red" }} />
              </div>
            </div>
          </div>
          <div className={styles.infoBottom}>
            <div className={styles.infoCenterTitle}>
              <div>
                <Text.caption
                  title="Người đặt cao nhất"
                  style={{ color: "#919293", marginBottom: "4px" }}
                />
              </div>
              <div>
                <Text.caption
                  title="Số lượt ra giá"
                  style={{ color: "#919293", marginBottom: "4px" }}
                />
              </div>
            </div>
            <div className={styles.infoCenterValue}>
              <div className={styles.hightBidder}>
                <Text.bodyHighlight title={bidder.name} />
                <p className={styles.percent}>
                  <Text.caption
                    title={`${bidder.percent}%`}
                    style={{ color: "#fff" }}
                  />
                </p>
              </div>
              <div className={styles.view}>
                <Text.bodyHighlight title={`${view} Lượt`} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <div>
            {status !== "sold" ? (
              <Button
                className={styles.action}
                style={{
                  height: "40px",
                }}
              >
                <Text.bodyHighlight title={`Cập nhật thông tin`} />
              </Button>
            ) : (
              <div>
                <Button
                  className={styles.action}
                  style={{
                    height: "40px",
                  }}
                >
                  <Text.bodyHighlight title={`Đánh giá người thắng`} />
                </Button>
                <Button
                  className={styles.action}
                  style={{
                    height: "40px",
                  }}
                >
                  <Text.bodyHighlight title={`Huỷ giao dịch`} />
                </Button>
              </div>
            )}
          </div>

          <div className={styles.postingDate}>
            <Text.caption
              title="Sản phẩm này được đăng tải ngày"
              style={{ color: "#919293", marginBottom: "6px" }}
            />
            <Text.bodyHighlight title={`${postingDate}`} />
          </div>
        </div>
      </div>
    </div>
  );
}