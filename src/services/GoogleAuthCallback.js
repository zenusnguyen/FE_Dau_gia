import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { NGROK_URL } from "../constants";
import { useHistory } from "react-router-dom";

function GoogleAuthCallback() {
  const [auth, setAuth] = useState();
  const history = useHistory();

  const location = useLocation();
  useEffect(() => {
    if (!location) {
      return;
    }
    const { search } = location;
    axios({
      method: "GET",
      url: `${NGROK_URL}/auth/google/callback?${search}`,
    }).then((res) => {
      setAuth(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setTimeout(() => {
       
        history.push("/home");
      }, 100);

      return res.data;
    });
  }, [location]);

  return (
    <div>
      {auth && (
        <>
          <div>Jwt: {auth.jwt}</div>
          <div>User Id: {auth.user.id}</div>
          <div>Provider: {auth.user.provider}</div>
        </>
      )}
    </div>
  );
}

export default GoogleAuthCallback;
