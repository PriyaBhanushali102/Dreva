import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button, Input } from "../index";

function LoginForm() {
  const navigate = useNavigate();
  const { loginUser, loginVendor, isLoading, error } = useAuth();
  const [isVendorLogin, setIsVendorLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    isVendorLogin ? await loginVendor(formData) : await loginUser(formData);
    navigate(isVendorLogin ? "/vendor/dashboard" : "/");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* LEFT SIDE: Branding - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-between overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* Logo */}
        <div className="relative z-10">
          <h1 className="text-white text-5xl font-black tracking-tight">
            DREVA
          </h1>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-5xl font-bold leading-tight">
            {isVendorLogin
              ? "Grow your business with Dreva."
              : "The best way to shop online."}
          </h2>
          <p className="text-slate-300 text-lg max-w-md">
            {isVendorLogin
              ? "Access your dashboard, manage inventory, and track sales in real-time."
              : "Secure, fast, and reliable. Join thousands of satisfied shoppers today."}
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex gap-8 text-slate-400 text-sm">
          <span>✓ Verified Platform</span>
          <span>✓ Secure Payments</span>
        </div>

        {/* Large decorative circle */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 border-4 border-white/5 rounded-full"></div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-300 p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">
              {isVendorLogin ? "Vendor Login" : "Welcome Back"}
            </h1>
            <p className="text-slate-500">Please enter your account details.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all bg-slate-50/50"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all bg-slate-50/50"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="space-y-4 text-center">
            <p className="text-slate-600 text-sm">
              New to Dreva?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Create Account
              </Link>
            </p>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-slate-500 text-sm mb-2">
                {isVendorLogin ? "Want to shop?" : "Are you a seller?"}
              </p>
              <button
                type="button"
                onClick={() => setIsVendorLogin(!isVendorLogin)}
                className="text-blue-600 font-black text-sm hover:text-blue-800 transition-colors uppercase tracking-wider"
              >
                {isVendorLogin ? "USER PORTAL" : "VENDOR PORTAL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;