// src/store/categorySlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axiosConfig";

// Fetch all categories from backend
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/categories");
      return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to fetch categories"
      );
    }
  }
);

// Optional: Async thunk to delete category from backend
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      return id; // return deleted category id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to delete category"
      );
    }
  }
);

// Optional: Async thunk to update category in backend
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // return updated category object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Failed to update category"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCategory: (state, action) => {
      const cat = action.payload;
      if (cat && cat._id && !state.list.some((c) => c._id === cat._id)) {
        state.list.push(cat);
      }
    },
    updateCategoryLocal: (state, action) => {
      const updated = action.payload;
      const index = state.list.findIndex((c) => c._id === updated._id);
      if (index !== -1) {
        state.list[index] = updated;
      }
    },
    deleteCategoryLocal: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((c) => c._id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.list.findIndex((c) => c._id === updated._id);
        if (index !== -1) {
          state.list[index] = updated;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { addCategory, updateCategoryLocal, deleteCategoryLocal } = categorySlice.actions;
export default categorySlice.reducer;
