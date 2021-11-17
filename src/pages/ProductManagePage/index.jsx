import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { Radio, Input, Table, Tag, Modal, message } from "antd";
import Text from "../../components/Text";
import LoadingPage from "../LoadingPage";
import { getAll as getAllUser } from "../../services/userApi";
import {
   getAll as getAllProduct,
   delProduct,
   search as searchProduct,
} from "../../services/productApi";
import moment from "moment";

export default function ProductManagePage(props) {
   const { viewDetail } = props;
   let productDel = useRef(null);
   const { Search } = Input;
   const { user } = useSelector((state) => state.user?.user);
   const [users, setUsers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [currentTab, setCurrentTab] = useState("a");
   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
   const [products, setProducts] = useState([]);
   const [isModalDel, setIsModalDel] = useState(false);

   const fetchData = async () => {
      setIsLoading(true);
      Promise.all([getAllProduct(), getAllUser()]).then((values) => {
         setProducts(
            values[0].map((value) => {
               const seller = values[1].find(
                  (user) => user.userId === value.ownerId
               );
               const nameSplit = seller.username.split(" ");
               return {
                  ...value,
                  currentPrice: `${value.currentPrice
                     .toString()
                     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")} đ`,
                  owner: `***${nameSplit[nameSplit.length - 1]}`,
                  postingDate: moment(value.postingDate).format(
                     "DD-MM-YYYY HH:mm"
                  ),
               };
            })
         );
         setIsLoading(false);
      });
   };

   useEffect(() => {
      fetchData();
   }, [user.id, currentTab]);

   const onSearch = async (e) => {
      setIsLoading(true);
      let products;
      if (e) products = await searchProduct(e);
      console.log(products);
      //else users = await getAllUser();
      // setUsers(
      //    users.map((user, i) => {
      //       return {
      //          key: i,
      //          ...user,
      //          dateOfBirth: moment(user.dateOfBirth).format("DD-MM-YYYY"),
      //       };
      //    })
      // );
      setIsLoading(false);
   };

   const onOkDel = () => {
      delProduct(productDel.current.id)
         .then(() => {
            fetchData();
            message.success("Xóa sản phẩm thành công", 10);
         })
         .catch(() => {
            message.success("Xóa sản phẩm thất bại!", 10);
         })
         .finally(() => setIsModalDel(false));
   };

   const onChangeTab = (e) => {
      setIsLoading(true);
      setCurrentTab(e.target.value);
      console.log("radio checked", e.target.value);
   };

   const onChangeSwitch = (checked, row) => {
      //Handle Toggle Role
      console.log("status:", checked);
      console.log("userSelect:", row);
   };

   const onViewDetail = (product) => {
      console.log(product);
      viewDetail("2.1", product.id);
   };

   const onTableChange = (checked) => {
      console.log(checked);
   };

   const onSelectChange = (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
   };

   const onRefuse = () => {
      //Handle Refuse
      console.log(selectedRowKeys);
   };

   const onAccept = () => {
      //Handle Accept
      console.log(selectedRowKeys);
   };

   const columns = [
      {
         title: "Ngày đăng",
         dataIndex: "postingDate",
      },
      {
         title: "Người bán",
         dataIndex: "owner",
      },
      {
         title: "Sản phẩm",
         dataIndex: "title",
      },
      {
         title: "Giá hiện tại",
         dataIndex: "currentPrice",
         align: "center",
      },
      {
         title: "Trạng thái",
         dataIndex: "status",
         align: "center",
         render: (status) => (
            <div>
               {status === "sold" ? (
                  <Tag color="green" style={{ textTransform: "uppercase" }}>
                     Đã bán
                  </Tag>
               ) : status === "processing" ? (
                  <Tag color="blue" style={{ textTransform: "uppercase" }}>
                     Đang đấu giá
                  </Tag>
               ) : (
                  <Tag color="red" style={{ textTransform: "uppercase" }}>
                     Hết hạn
                  </Tag>
               )}
            </div>
         ),
      },
      {
         title: "Hành động",
         dataIndex: "actions",
         render: (value, row, index) => (
            <div>
               <button className={styles.btn} onClick={() => onViewDetail(row)}>
                  <Text.underline title="Xem chi tiết" color="primary" />
               </button>
               <button
                  className={styles.btn}
                  onClick={() => {
                     productDel.current = row;
                     setIsModalDel(true);
                  }}
               >
                  <Text.underline title="Gỡ bỏ" color="gray" />
               </button>
            </div>
         ),
      },
   ];

   const rowSelection = {
      onChange: onSelectChange,
   };

   return (
      <div className={styles.container}>
         <div className={styles.top}>
            <Text.h3 title="Quản lý sản phẩm" />{" "}
            <Search
               placeholder="Tìm kiếm sản phẩm"
               onSearch={onSearch}
               style={{ width: 264, marginRight: "16px" }}
            />
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <Table
               columns={columns}
               dataSource={products}
               onChange={onTableChange}
               style={{ marginTop: "20px" }}
            />
         )}{" "}
         <Modal
            title={<Text.bodyHighlight title="Xác nhận xóa" />}
            visible={isModalDel}
            onOk={() => onOkDel()}
            onCancel={() => setIsModalDel(false)}
            okText={<Text.caption title="Đồng ý" />}
            cancelText={<Text.caption title="Hủy" />}
         >
            <Text.caption
               title={`Sản phẩm này sẽ không thể khôi phục nếu bị xoá. Bạn có chắc muốn tiếp tục?`}
            />
         </Modal>
      </div>
   );
}
