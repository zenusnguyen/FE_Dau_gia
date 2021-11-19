import React, { useEffect, useState } from "react";
import Text from "../Text";
import moment from "moment";

export default function TimeCount(props) {
   const { productEndTime, callBackTimeEnd, children } = props;
   const [timeRemaining, setTimeRemaining] = useState("");

   const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
         return React.cloneElement(child, {
            title: timeRemaining,
            style: { color: "red" },
         });
      }
      return child;
   });

   const count = () => {
      const currentTime = moment();
      const endTime = moment(productEndTime);
      const seconds = endTime.diff(currentTime, "seconds");
      const minutes = endTime.diff(currentTime, "minutes");
      const hours = endTime.diff(currentTime, "hours");
      const day = endTime.diff(currentTime, "days");
      if (seconds < 0) {
         setTimeRemaining(`Đã kết thúc`);
         if (typeof callBackTimeEnd === "function") {
            callBackTimeEnd();
         }
      } else {
         if (day > 0) {
            if (day < 3) {
               if (day === 0) {
                  if (hours === 0) {
                     setTimeRemaining(`${minutes} phút nữa`);
                  } else {
                     setTimeRemaining(`${hours} giờ nữa`);
                  }
               } else {
                  setTimeRemaining(`${day} ngay nữa`);
               }
            } else {
               if (hours - 24 * day !== 0)
                  setTimeRemaining(`${day} ngày ${hours - 24 * day}h`);
               else setTimeRemaining(`${day - 1} ngày 23 giờ`);
            }
         } else {
            if (hours === 0) {
               if (minutes === 0) {
                  setTimeRemaining(`${seconds} giây nữa`);
               } else {
                  setTimeRemaining(`${minutes} phút nữa`);
               }
            } else {
               setTimeRemaining(`${hours} giờ nữa`);
            }
         }
      }
   };

   useEffect(() => {
      count();
      const interval = setInterval(() => {
         count();
      }, 1000);

      return () => clearInterval(interval);
   }, [productEndTime]);

   return <div style={{ width: "100%" }}>{childrenWithProps}</div>;
}
