import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import { Table } from "antd";
import { getById } from "../../services/userApi";
import { getByUser } from "../../services/evaluateApi";
import LoadingPage from "../LoadingPage";

import moment from "moment";

export default function EvaluatePage(props) {
   const { user } = useSelector((state) => state.user?.user);
   const [currentUser, setCurrentUser] = useState({});
   const [evaluates, setEvaluates] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      Promise.all([getById(user.id), getByUser(user.id)]).then((values) => {
         setCurrentUser(values[0]);
         const data = values[1].map((value, i) => {
            return {
               key: i,
               assessor: value.senderName,
               time: moment(value.time).format("DD-MM-YYYY HH:mm"),
               score: value.score > 0 ? "+1" : "-1",
               review: value.content,
            };
         });
         setIsLoading(false);
         setEvaluates(data);
      });
   }, [user]);

   const columns = [
      {
         title: "Thời gian",
         dataIndex: "time",
         width: "158px",
      },
      {
         title: "Người đánh giá",
         dataIndex: "assessor",
         width: "150px",
      },
      {
         title: "Điểm",
         dataIndex: "score",
         width: "60px",
      },
      {
         title: "Nhận xét",
         dataIndex: "review",
      },
   ];

   return (
      <div className={styles.evaluatePage}>
         {isLoading ? (
            <LoadingPage />
         ) : (
            <div>
               <Text.h3 title="Điểm đánh giá" />
               <div className={styles.percent}>
                  <Text.h1 title={`${currentUser.score * 10}%`} />
               </div>
               <div className={styles.table}>
                  <Table columns={columns} dataSource={evaluates} />
               </div>
            </div>
         )}
      </div>
   );
}
