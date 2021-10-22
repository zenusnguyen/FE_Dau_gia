import React from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import { Table } from "antd";

export default function EvaluatePage(props) {
   const data = {
      percent: 80,
      reviews: [
         {
            key: "1",
            time: "02/09/2021 10:44",
            assessor: "***Anh",
            score: "+1",
            review:
               "Thằng em mình học bách khoa cơ khí, sinh năm 96. Tự mày mò học code rồi đi làm remote cho công ty Mỹ 2 năm nay. Mỗi tối online 3-4 giờ là xong việc. Lương tháng 3k6.",
         },
         {
            key: "2",
            time: "02/09/2021 10:35",
            assessor: "***Quang",
            score: "-1",
            review:
               "Ra xã hội làm ăn bươn chải, liều thì ăn nhiều, không liều thì ăn ít. Muốn thành công thì phải chấp nhận trải qua đắng cay ngọt bùi. Làm ăn muốn kiếm được tiền thì phải chấp nhận mạo hiểm, nguy hiểm một tí nhưng trong tầm kiểm soát. Xã hội này, chỉ có làm, chịu khó cần cù thì bù siêng năng. Chỉ có làm thì mới có ăn. Những cái loại không làm mà đòi có ăn thì ăn đầu ruồi nhá, ăn mứt. Thế cho nó dễ!",
         },
         {
            key: "3",
            time: "02/09/2021 10:31",
            assessor: "***Nga",
            score: "+1",
            review:
               "Tạm biệt Kang Daniel, khóc xong rồi thì thôi cất gọn poster anh vào góc, mình tạm thời không nhìn nhau anh nhé.",
         },
         {
            key: "4",
            time: "02/09/2021 8:10",
            assessor: "***Giang",
            score: "+1",
            review:
               "Trong cuộc sống hàng ngày nếu như mà một couple mà nếu cả hai người lại quá phụ thuộc vào cảm xúc thì liệu rằng mối quan hệ đấy có healthy không? Balance không?",
         },
      ],
   };
   const columns = [
      {
         title: "Thời gian",
         dataIndex: "time",
         width: "158px",
         sorter: (a, b) => new Date(a.time) - new Date(b.time),
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
         <Text.h3 title="Điểm đánh giá" />
         <div className={styles.percent}>
            <Text.h1 title="80%" />
         </div>
         <div className={styles.table}>
            <Table columns={columns} dataSource={data.reviews} />
         </div>
      </div>
   );
}
