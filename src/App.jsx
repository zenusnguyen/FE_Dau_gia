import styles from "./styles.module.css";
import io from "socket.io-client";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./configs/PrivateRoute";
import GoogleAuthCallback from "./services/GoogleAuthCallback";
import FacebookAuthCallback from "./services/FacebookAuthCallback";
// import { loadReCaptcha } from "react-recaptcha-google";
import React, { useEffect } from "react";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Header";
import ProfileManagement from "./pages/ProfileManagement";

const STRAPI_ENDPOINT = "http://localhost:1337";

function App() {
   // useEffect(() => loadReCaptcha(), []);
   return (
      <Router>
         <div>
            <div className={styles.appWrapper}>
               <Header></Header>
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
                     <Route path="/product/:productId">
                        <ProductDetailPage />
                     </Route>
                     <Route path="/register">
                        <RegisterPage />
                     </Route>
                     <Route path="/" exact>
                        <HomePage />
                     </Route>
                     <Route path="/search/:searchWord/page/:pageNumber" exact>
                        <SearchPage />
                     </Route>
                     <Route
                        path="/category/:categoryId/sub/:subId/page/:pageNumber"
                        exact
                     >
                        <ProductListPage />
                     </Route>
                     <Route path="/profile/:page" exact>
                        <ProfileManagement />
                     </Route>
                     <Route path="/home">
                        <HomePage />
                     </Route>
                  </Switch>
               </div>
            </div>
         </div>
      </Router>
   );
}

export default App;
