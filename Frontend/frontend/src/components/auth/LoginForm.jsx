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
    isVendorLogin ? await loginVendor(formData) : loginUser(formData);

    navigate(isVendorLogin ? "/vendor/dashboard" : "/");

  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Welcome Back
      </h2>

      {/* Vendor / User Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded p-1 shadow-inner">
        <Button
          type="button"
          onClick={() => setIsVendorLogin(false)}
          className={`flex-1 py-2 rounded transition-all duration-300  ${
            !isVendorLogin
              ? "outline"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          User
        </Button>

        <Button
          type="button"
          onClick={() => setIsVendorLogin(true)}
          className={`flex-1 py-2 rounded transition-all duration-300 ${
            isVendorLogin
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Vendor
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            placeholder="Email@ex.com"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            type="password"
            value={formData.password}
            placeholder="Enter Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            required
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isLoading ? "Logging in..." : `Login as ${isVendorLogin ? "Vendor" : "User"}`}
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-semibold"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
