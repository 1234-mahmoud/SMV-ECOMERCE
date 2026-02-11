import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const result = await dispatch(loginUser({ email, password, role }));
    
   if (loginUser.fulfilled.match(result)) {
  const userRole = result.payload.user.role;

  if (userRole === "Admin") {
    navigate("/dashboard");
  } else {
    navigate("/");
  }
}
  };

  return (
    <div className={`flex justify-center items-center gap-10 h-lvh`}>
      <div
        className={`welcome h-full
      hidden
      md:flex flex-col justify-center items-center gap-5 flex-1/2 text-[rgb(var(--main-color))]
         bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
         
        `}
      >
        <h1
          className={`font-semibold text-4xl lg:text-5xl`}
        >
          Welcome to SMV-ECOM
        </h1>
        <p className={`text-xl`}>Your trusted multi-vendor marketplace</p>
      </div>
      {/* -------------------Login Form --------------------------- */}
      <div className={`login_form flex-1/2 px-12`}>
        <form
          onSubmit={handleSubmit}
          className={`
        flex flex-col gap-6
        `}
        >
          <h1 className={`font-bold text-2xl lg:text-3xl leading-15`}>Login to Your Account</h1>
          {error && (
            <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded`}>
              {error}
            </div>
          )}
          <div className={`mail  flex flex-col gap-1`}>
            <span className="text-lg font-semibold">Email Address</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border border-gray-400 p-2 rounded-md focus:outline-0`}
            />
          </div>

          <div className={`pass flex flex-col gap-1`}>
            <span className="text-lg font-semibold">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border border-gray-400 p-2 rounded-md focus:outline-0`}
            />
          </div>

          <div className={`role flex flex-col gap-1`}>
            <span className="text-lg font-semibold">Login as</span>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`border border-gray-400 p-2 rounded-md focus:outline-0`}
            >
              <option value="Customer">Customer</option>
              <option value="Seller">Seller</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={status === "loading"}
            className={`text-[rgb(var(--main-color))]
            bg-blue-600 rounded-md py-3 text-xl my-3
            ${status === "loading" ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
            <span className={`text-center text-lg text-gray-500`}>Don't have an account?<Link to="/register" className={`font-semibold mx-2 text-blue-500 underline hover:text-blue-700`}>Register</Link></span>
        </form>
      </div>
    </div>
  );
}
