import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { Radio, Input, Table, Switch, Button, Modal } from "antd";
import Text from "../../components/Text";
import LoadingPage from "../LoadingPage";
import { getAll as getAllUser, search } from "../../services/userApi";
import { getAll as getAllLicence } from "../../services/licenceApi";
import moment from "moment";

export default function UserManagePage(props) {
   const { viewDetail } = props;
   const { Search } = Input;
   const { user } = useSelector((state) => state.user?.user);
   const [users, setUsers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [currentTab, setCurrentTab] = useState("a");
   const [selectedRowKeys, setSelectedRowKeys] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         const users = await getAllUser();
         if (currentTab === "a") {
            setUsers(
               users.map((user, i) => {
                  return {
                     key: user.userId,
                     ...user,
                     dateOfBirth: moment(user.dateOfBirth).format("DD-MM-YYYY"),
                  };
               })
            );
         } else {
            const allAwaiting = await getAllLicence();
            const allAwaitingId = allAwaiting.map(
               (awaiting) => awaiting.bidderId
            );
            const awaitingUser = users
               .filter((user) => allAwaitingId.includes(user.userId))
               .map((user) => {
                  const awaiting = allAwaiting.find(
                     (awaiting) => awaiting.bidderId === user.userId
                  );
                  return {
                     ...user,
                     time: moment(awaiting.time).format("DD-MM-YYYY"),
                  };
               });
            setUsers(awaitingUser);
         }
         setIsLoading(false);
      };
      fetchData();
   }, [user.id, currentTab]);

   const onSearch = async (e) => {
      setIsLoading(true);
      let users;
      if (e) users = await search(e);
      else users = await getAllUser();
      setUsers(
         users.map((user, i) => {
            return {
               key: i,
               ...user,
               dateOfBirth: moment(user.dateOfBirth).format("DD-MM-YYYY"),
            };
         })
      );
      setIsLoading(false);
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

   const onViewDetail = (user) => {
      viewDetail("5.1", user.userId);
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
         title: "Họ tên",
         dataIndex: "username",
      },
      {
         title: "Email",
         dataIndex: "email",
      },
      {
         title: "Ngày sinh",
         dataIndex: "dateOfBirth",
      },
      {
         title: "Người bán hàng",
         dataIndex: "isSeller",
         align: "center",
         render: (value, row, index) => (
            <Switch
               defaultChecked
               onChange={(status) => onChangeSwitch(status, row)}
            />
         ),
      },
      {
         title: "Hành động",
         dataIndex: "actions",
         render: (value, row, index) => (
            <button className={styles.btn} onClick={() => onViewDetail(row)}>
               <Text.underline title="Chỉnh sữa" color="primary" />
            </button>
         ),
      },
   ];

   const columnsB = [
      {
         title: "Họ tên",
         dataIndex: "username",
      },
      {
         title: "Email",
         dataIndex: "email",
      },
      {
         title: "Ngày sinh",
         dataIndex: "dateOfBirth",
      },
      {
         title: "Ngày xin cấp",
         dataIndex: "time",
      },
   ];

   const rowSelection = {
      onChange: onSelectChange,
   };

   return (
      <div className={styles.container}>
         <div className={styles.top}>
            <Text.h3 title="Tất cả người dùng" />
            <div>
               {currentTab === "a" && (
                  <Search
                     placeholder="Tìm kiếm người dùng"
                     onSearch={onSearch}
                     style={{ width: 264, marginRight: "16px" }}
                  />
               )}
               <Radio.Group
                  defaultValue="a"
                  defaultValue="a"
                  value={currentTab}
                  onChange={onChangeTab}
               >
                  <Radio.Button value="a">
                     <Text.caption title="Tất cả" />
                  </Radio.Button>
                  <Radio.Button value="b">
                     <Text.caption title="Chờ duyệt" />
                  </Radio.Button>
               </Radio.Group>
            </div>
         </div>
         {isLoading ? (
            <LoadingPage />
         ) : currentTab === "a" ? (
            <Table
               columns={columns}
               dataSource={users}
               onChange={onTableChange}
               style={{ marginTop: "20px" }}
            />
         ) : (
            <div>
               <Button type="primary" onClick={() => onAccept()}>
                  <Text.caption title="Chấp nhận" />
               </Button>
               <Button className={styles.refuse} onClick={() => onRefuse()}>
                  <Text.caption title="Từ chối" />
               </Button>
               <Table
                  rowSelection={rowSelection}
                  columns={columnsB}
                  dataSource={users}
               />
            </div>
         )}
      </div>
   );
}
