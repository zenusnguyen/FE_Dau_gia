import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const NGROK_URL = "localhost:1337";

function FacebookAuthCallback() {
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
      url: `${NGROK_URL}/auth/facebook/callback?${search}`,
    }).then((res) => {
      console.log("res.data: ", res.data);
      return res.data;
    });

    console.log("auth: ", auth);
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

export default FacebookAuthCallback;
