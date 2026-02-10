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
      // Normalize ID: use _id if id doesn't exist (MongoDB uses _id)
      const productId = product.id || product._id;
      const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;
      const existingItem = state.items.find(
        (item) => (item.id || item._id) === productId
      );

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
        existingItem.totalPrice += product.price * quantityToAdd;
      } else {
        state.items.push({
          ...product,
          id: productId, // Ensure id field exists
          _id: product._id, // Keep _id for reference
          quantity: quantityToAdd,
          totalPrice: product.price * quantityToAdd,
        });
      }

      state.totalAmount += product.price * quantityToAdd;
    },

    increment(state, action) {
      const itemId = action.payload;
      const item = state.items.find(
        (item) => (item.id || item._id) === itemId
      );

      if (!item) return;

      item.quantity++;
      item.totalPrice += item.price;
      state.totalAmount += item.price;
    },

    decrement(state, action) {
      const itemId = action.payload;
      const item = state.items.find(
        (item) => (item.id || item._id) === itemId
      );

      if (!item) return;

      if (item.quantity === 1) {
        const itemIdentifier = item.id || item._id;
        state.items = state.items.filter(
          (i) => (i.id || i._id) !== itemIdentifier
        );
        state.totalAmount -= item.price;
      } else {
        item.quantity--;
        item.totalPrice -= item.price;
        state.totalAmount -= item.price;
      }
    },

    removeFromCart(state, action) {
      const itemId = action.payload;
      const item = state.items.find(
        (item) => (item.id || item._id) === itemId
      );

      if (!item) return;

      state.totalAmount -= item.totalPrice;
      state.items = state.items.filter(
        (i) => (i.id || i._id) !== itemId
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
