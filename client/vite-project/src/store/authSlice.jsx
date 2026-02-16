import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000";

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, loginData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Login failed"
      );
    }
  }
);

// ================= REGISTER =================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (registerData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, registerData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Registration failed"
      );
    }
  }
);

// ================= VERIFY TOKEN =================
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get(`${API_URL}/verifyToken`, {
        headers: {
          Authorization: `Bearer ${token}`,   
        },
      });

      return res.data;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return rejectWithValue(
        error.response?.data?.error || "Token verification failed"
      );
    }
  }
);

// ================= LOAD INITIAL STATE =================
const loadInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      return {
        token,
        user: JSON.parse(userStr),
        isAuthenticated: true,
        status: "idle",
        error: null,
      };
    }
  } catch (error) {
    console.error("Error loading auth state:", error);
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  };
};

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // VERIFY TOKEN
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
