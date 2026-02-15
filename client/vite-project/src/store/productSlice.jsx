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

// Thunk --> for updating a product (seller only)
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/seller/products/${id}`, productData);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to update product"
      );
    }
  }
);

// Thunk --> for deleting a product (seller only)
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/seller/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to delete product"
      );
    }
  }
);

// Thunk --> for fetching all products (admin only)
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/products");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to fetch products"
      );
    }
  }
);

// Thunk --> for updating any product (admin only)
export const updateProductAdmin = createAsyncThunk(
  "products/updateProductAdmin",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/products/${id}`, productData);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to update product"
      );
    }
  }
);

// Thunk --> for deleting any product (admin only)
export const deleteProductAdmin = createAsyncThunk(
  "products/deleteProductAdmin",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to delete product"
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
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProductAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProductAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProductAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteProductAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProductAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProductAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default productSlice.reducer;
