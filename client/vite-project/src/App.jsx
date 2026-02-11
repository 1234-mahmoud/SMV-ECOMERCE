import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Orders from "./components/Orders";
import Analatics from "./components/Analatics";
import WishList from "./components/WishList";
import CreateProduct from "./pages/CreateProduct";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />

        {/* Cart (any logged user) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <Dashboard comp={<Analatics />} />
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute role="Seller">
              <Dashboard comp={<CreateProduct/>} />
            </ProtectedRoute>
          }
        />
      {/* Orders */}
          <Route
          path="/orders" element={<Dashboard comp={<Orders />} />}
        />

         {/* WishList */}
          <Route
          path="/wishlist" element={<Dashboard comp={<WishList />} />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
