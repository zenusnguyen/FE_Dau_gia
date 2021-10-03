import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function GoogleAuthCallback() {
  const [auth, setAuth] = useState();
  console.log("auth: ", auth);
  const location = useLocation();
  console.log("location: ", location);
  useEffect(() => {
    if (!location) {
      return;
    }
    const { search } = location;
    axios({
      method: "GET",
      url: `http://localhost:1337/auth/google/callback?${search}`,
    })
      .then((res) => res.data)
      .then(setAuth);
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
