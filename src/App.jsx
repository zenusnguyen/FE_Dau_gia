import styles from "./styles.module.css";
import io from "socket.io-client";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./configs/PrivateRoute";
import GoogleAuthCallback from "./services/GoogleAuthCallback";
import FacebookAuthCallback from "./services/FacebookAuthCallback";
// import { loadReCaptcha } from "react-recaptcha-google";
import React, { useEffect } from "react";

const STRAPI_ENDPOINT = "http://localhost:1337";

function App() {
   // useEffect(() => loadReCaptcha(), []);
   return (
      <div className={styles.appWrapper}>
         <Router>
            <div className={styles.container}>
               <Switch>
                  <Route path="/auth/google/callback">
                     <GoogleAuthCallback />
                  </Route>
                  <Route path="/auth/facebook/callback">
                     <FacebookAuthCallback />
                  </Route>
                  <Route path="/login">
                     <LoginPage />
                  </Route>
                  <Route path="/register">
                     <RegisterPage />
                  </Route>
                  <Route path="/" exact>
                     <HomePage />
                  </Route>
                  <PrivateRoute
                     component={HomePage}
                     path="/home"
                  ></PrivateRoute>
               </Switch>
            </div>
         </Router>
      </div>
   );
}

export default App;
