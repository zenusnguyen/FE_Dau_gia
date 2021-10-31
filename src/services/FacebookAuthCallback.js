import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { NGROK_URL } from "../constants";

function FacebookAuthCallback() {
  const history = useHistory();
  const [auth, setAuth] = useState();
  const location = useLocation();
  useEffect(() => {
    if (!location) {
      return;
    }
    const { search } = location;
    console.log("search: ", search);
    axios({
      method: "GET",
      url: `${NGROK_URL}/auth/facebook/callback/${search}`,
    }).then((res) => {
      setAuth(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setTimeout(() => {
        history.push("/home");
      }, 100);

      return res.data;
    });
  }, [location]);

  return <div>{auth && <></>}</div>;
}

export default FacebookAuthCallback;
