import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axiosConfig";

// Thunk --> for fetching products from DB (optional category filter)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (categoryId = null) => {
    const url = categoryId ? `/products?category=${categoryId}` : "/products";
    const res = await api.get(url);
    return res.data;
  }
);

// Thunk --> for adding new product (uses api so token is sent)
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await api.post("/createProduct", productData);
      return res.data.product || res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to create product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newProduct = action.payload.product || action.payload;
        state.products.push(newProduct);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default productSlice.reducer;
