import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/api"; // Using your centralized API service

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await loginUser(formData);
      setMessage({ 
        text: "Login successful! Redirecting...", 
        type: "success" 
      });
      
      // Store token and redirect after delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setMessage({
        text: error.message || "Login failed. Please check your credentials.",
        type: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[650px]">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:p-12 mt-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1
              className="text-4xl text-center font-bold text-gray-900 mb-2"
              style={{ fontFamily: "Brush Script MT, cursive" }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hey there!
            </h2>
            <p className="text-gray-600">
              Enter your email and password to login
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white font-semibold py-3 rounded-lg transition-all duration-200 ${
                loading 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "hover:bg-gray-800 transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline"
                >
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
        <img
          src="https://www.brides.com/thmb/JcdtVSFkiDT_FojuI32P0SQlrss=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/37-redwoods-outdoor-chapel-wedding-reception-dance-floor-ryan-ray-0524-65f65fcbd02f49e789f42482b59e8749.JPG"
          alt="Wedding reception"
          className="w-full h-full object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end justify-start p-12 z-20">
          <div className="text-white max-w-md">
            <h3 className="text-3xl font-bold mb-4">Welcome Back</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              Trusted by thousands to manage events that inspire and impress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;