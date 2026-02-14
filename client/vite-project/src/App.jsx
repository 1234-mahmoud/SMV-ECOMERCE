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
import ProductDetails from "./pages/ProductDetails";
import Orders from "./components/Orders";
import WishList from "./components/WishList";
import CreateProduct from "./pages/CreateProduct";
import Admin from "./pages/Admin";
import SellerDashboard from "./pages/SellerDashboard";
import Users from "./pages/Users";
import SellersData from "./pages/SellersData";

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
        <Route path="/products/:id" element={<ProductDetails />} />

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
              <Dashboard comp={<Admin />} />
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute role="Seller">
              <Dashboard comp={<SellerDashboard />} />
            </ProtectedRoute>
          }
        />
        {/* Orders - protected: any logged-in user */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Dashboard comp={<Orders />} />
            </ProtectedRoute>
          }
        />
{/*users - Admin only so customer data loads */}
        <Route
          path="/users"
          element={
            <ProtectedRoute role="Admin">
              <Dashboard comp={<Users />} />
            </ProtectedRoute>
          }
        />

{/*sellers data*/}
        <Route
          path="/sellersdata"
          element={
            <ProtectedRoute>
              <Dashboard comp={<SellersData />} />
            </ProtectedRoute>
          }
        />

        {/*categories*/}
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Dashboard comp={<Categories />} />
            </ProtectedRoute>
          }
        />



        {/* Wishlist - protected: any logged-in user */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Dashboard comp={<WishList />} />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
