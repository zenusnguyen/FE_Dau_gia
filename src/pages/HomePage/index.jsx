import React from "react";
import styles from "./index.css";
import { socket } from "../../services/socket";
import { Button } from "antd";

export default function HomePage() {
  const username = "anh";
  const room = "1";

  socket.on("welcome", (data) => {
    console.log("data: ", data);
  });
  const handleClick = () => {
    socket.emit("join", { username, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  };
  return (
    <div>
      HomePage
      <Button onClick={handleClick}>connect</Button>
    </div>
  );
}
