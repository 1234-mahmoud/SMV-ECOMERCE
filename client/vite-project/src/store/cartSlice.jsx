import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage on initialization
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const parsed = JSON.parse(cartData);
      return {
        items: parsed.items || [],
        totalAmount: parsed.totalAmount || 0,
      };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }
  return {
    items: [],
    totalAmount: 0,
  };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const qty = Math.max(1, Number(product.quantity) || 1);//if their is a products --> return the num of it or 1
      const productId = String(product.id || product._id); //as the returned id from db is str
      const existingItem = state.items.find(
        (item) => String(item.id || item._id) === productId
      );

      if (existingItem) {
        existingItem.quantity += qty;
        existingItem.totalPrice += product.price * qty;
      } else {
        state.items.push({
          ...product,
          id: productId,  // normalized ID (always string)
          _id: product._id, // original MongoDB ID
          quantity: qty,
          totalPrice: product.price * qty,
        });
      }

      state.totalAmount += product.price * qty;
    },

    increment(state, action) {
      const itemId = String(action.payload);
      const item = state.items.find(
        (item) => String(item.id || item._id) === itemId
      );

      if (!item) return;

      item.quantity++;
      item.totalPrice += item.price;
      state.totalAmount += item.price;
    },

    decrement(state, action) {
      const itemId = String(action.payload);
      const item = state.items.find(
        (item) => String(item.id || item._id) === itemId
      );

      if (!item) return;

      if (item.quantity === 1) {
        state.items = state.items.filter(
          (i) => String(i.id || i._id) !== itemId //in the cart
        );
        state.totalAmount -= item.price;
      } else {
        item.quantity--;
        item.totalPrice -= item.price;
        state.totalAmount -= item.price;
      }
    },

    removeFromCart(state, action) {
      const itemId = String(action.payload);
      const item = state.items.find(
        (item) => String(item.id || item._id) === itemId
      );

      if (!item) return;

      state.totalAmount -= item.totalPrice;
      state.items = state.items.filter(
        (i) => String(i.id || i._id) !== itemId
      );
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  increment,
  decrement,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
