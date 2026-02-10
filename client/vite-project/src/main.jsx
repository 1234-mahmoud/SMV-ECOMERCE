import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import "./style/index.css";
import App from "./App.jsx";
import { Provider, useDispatch } from "react-redux";

import { store } from "./store/Store.js";
import { verifyToken } from "./store/authSlice";

// Component to verify token on app load
function AppWithAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
