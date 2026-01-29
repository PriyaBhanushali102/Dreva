import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button, Input } from "../index";

function RegisterForm() {
  const navigate = useNavigate();
  const { registerUser, registerVendor, isLoading, error } = useAuth();

  const [isVendorRegister, setIsVendorRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "", // vendor only
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isVendorRegister
      ? await registerVendor(formData)
      : await registerUser(formData);
    
    if (result.success) {
      navigate(isVendorRegister ? "/vendor/dashboard" : "/");
    }
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
            {isVendorRegister
              ? "Start your business journey."
              : "Join thousands of happy shoppers."}
          </h2>
          <p className="text-slate-300 text-lg max-w-md">
            {isVendorRegister
              ? "Create your vendor account and start selling to millions of customers today."
              : "Create your account and discover amazing products from trusted sellers."}
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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-300 p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">
              Create Account
            </h1>
            <p className="text-slate-500">
              {isVendorRegister 
                ? "Start your business journey today" 
                : "Create an account to start shopping"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all bg-slate-50/50"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all bg-slate-50/50"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all bg-slate-50/50"
                required
              />
            </div>

            {/* Vendor-only fields */}
            {isVendorRegister && (
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                  Business Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your business"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all bg-slate-50/50 resize-none"
                  required
                />
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-semibold text-slate-700">
                Profile Image
              </label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all bg-slate-50/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-900 file:cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
            >
              {isLoading 
                ? "Creating account..." 
                : (isVendorRegister ? "Register as Vendor" : "Register as User")}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="space-y-4 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Login here
              </Link>
            </p>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-slate-500 text-sm mb-2">
                {isVendorRegister ? "Looking to shop instead?" : "Are you a business owner?"}
              </p>
              <button
                type="button"
                onClick={() => setIsVendorRegister(!isVendorRegister)}
                className="text-blue-600 font-black text-sm hover:text-blue-800 transition-colors uppercase tracking-wider"
              >
                {isVendorRegister ? "REGISTER AS USER" : "BECOME A VENDOR"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;