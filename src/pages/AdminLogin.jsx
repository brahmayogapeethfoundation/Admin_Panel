import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../auth/auth";
import { adminLogin } from "../api/api"; // <- use API from api.js
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await adminLogin(username, password);
      // console.log("Login Request")
      loginSuccess(data.token); 
      navigate("/dashboard");  
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">Admin Login</h1>
        <p className="text-gray-400 text-center">
          Enter your credentials to access the dashboard
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 text-white
              bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
              hover:bg-gradient-to-br
              focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
              font-medium rounded-lg text-sm px-4 py-2.5 leading-5
              transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-center text-sm mt-4">
          &copy; 2026 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
