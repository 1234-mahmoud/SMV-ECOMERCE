import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import "./style/index.css";
import App from "./App.jsx";
import { Provider, useDispatch } from "react-redux";

import { store } from "./store/Store.js";
import { verifyToken } from "./store/authSlice";

// Restore login on reload: verify token when we have one in localStorage
function AppWithAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppWithAuth />
    </BrowserRouter>
  </Provider>
);
