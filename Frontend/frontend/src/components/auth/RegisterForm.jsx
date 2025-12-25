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
    
    console.log("Registration result:", result);
    if (result.success) {
      navigate(isVendorRegister ? "/vendor/dashboard" : "/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Account
      </h2>

      {/* Vendor / User Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded p-1 shadow-inner">
        <Button
          type="button"
          onClick={() => setIsVendorRegister(false)}
          className={`flex-1 py-2 rounded transition-all duration-300  ${
            !isVendorRegister
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          User
        </Button>

        <Button
          type="button"
          onClick={() => setIsVendorRegister(true)}
          className={`flex-1 py-2 rounded transition-all duration-300 ${
            isVendorRegister
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
        {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}      
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Vendor-only fields */}
          {isVendorRegister && (
            <>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                <textarea
                  id="description"
                  placeholder="Describe your business"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>
            </>
          )}
        
          {/* Image Upload */}
          <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
          </div>
        
          {/* Submit Button */}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isVendorRegister ? "Register as Vendor" : "Register as User"}
          </Button>
      </form>


      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:underline font-semibold"
        >
          Login here
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
