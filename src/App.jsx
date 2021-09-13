import styles from "./App.less";
import io from "socket.io-client";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const STRAPI_ENDPOINT = "http://localhost:1337";

function App() {
  return (
    <div className={styles.App}>
      <RegisterPage></RegisterPage>
    </div>
  );
}

export default App;
