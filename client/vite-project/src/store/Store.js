import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import headerReducer from './headerSlice'
import cartReducer from './cartSlice'
import productReducer from "./productSlice";
import authReducer from "./authSlice";

// Middleware to save cart to localStorage whenever cart state changes
const cartPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only save to localStorage if the action affects the cart
  if (action.type?.startsWith('cart/')) {
    const cartState = store.getState().cart;
    try {
      localStorage.setItem("cart", JSON.stringify(cartState));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    header:headerReducer,
    cart:cartReducer,
    products: productReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
});
