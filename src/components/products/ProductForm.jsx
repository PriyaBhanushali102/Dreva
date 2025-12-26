import { useState, useEffect } from "react";
import { CATEGORIES } from "../../utils/constants";
import { Select, Button, Input} from "../index.js";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";
import axios from "axios";
function ProductForm({ initialData, onSuccess, onCancel }) {
  const { isVendor, isAuthenticated } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    quantity: 0,
    price: 0,
    delivery: "",
  });

  // Images
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      const { images = [], ...rest } = initialData;
      setFormData(rest);
      setExistingImages(images);
    }
  }, [initialData]);

  if (!isAuthenticated || !isVendor) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 font-medium">
          You must be logged in as a vendor to access this page.
        </p>
      </div>
    );
  }

  // Form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length > 5
    if(totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const filteredFiles = files.filter((file) => {
      return !newImages.some(
        (img) => img.name === file.name && img.size === file.size
      );
    });
    setNewImages((prev) => [...prev, ...filteredFiles]);
  };

  // Remove images
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand) {
      toast.error("Please fill all required fields");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (formData.quantity < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    try {
      setIsLoading(true);
      const data = new FormData();
      
      const uniqueExistingImages = Array.from(
        new Map(existingImages.map(img => [img.url + img.filename, img])).values()
      );
      
      data.append("product", JSON.stringify(formData));
      data.append("existingImages", JSON.stringify(uniqueExistingImages));
      newImages.forEach((img) => data.append("images", img));

      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products/create";

      const method = initialData ? "put" : "post";

      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success(
        initialData ? "Product updated successfully!" : "Product added successfully!"
      );

      if (onSuccess) onSuccess(response.data);
      setNewImages([]);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
    >
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? "Edit Product" : "Add New Product"}
      </h3>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="form-label">Product Name : </label>
          <Input
            type="text"
            name="name"
            placeholder="e.g. Wireless Bluetooth Headphones"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
            minLength={5}
          />
        </div>

        <div>
          <label className="form-label">Brand : </label>
          <Input
            type="text"
            name="brand"
            placeholder="e.g. Boat, Sony, Samsung"
            value={formData.brand}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={CATEGORIES}
          required
        />

        <div>
          <label className="form-label">Price (₹) : </label>
          <Input
            type="number"
            name="price"
            placeholder="e.g. 1999"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            min="1"
            required
          />
        </div>

        <div>
          <label className="form-label">Available Quantity : </label>
          <Input
            type="number"
            name="quantity"
            placeholder="e.g. 50"
            value={formData.quantity}
            onChange={handleChange}
            className="form-input"
            min="0"
            required
          />
        </div>

        <div>
          <label className="form-label">Delivery Info : </label>
          <Input
            type="text"
            name="delivery"
            placeholder="e.g. Free delivery in 3–5 days"
            value={formData.delivery}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-5">
        <label className="form-label">Product Description : </label>
        <textarea
          name="description"
          placeholder="Describe your product features, quality, warranty, usage, etc."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="form-input resize-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
          minLength={20}
          required
        />
      </div>

      {/* EXISTING IMAGES */}
      {existingImages.length > 0 && (
        <div className="mt-5">
          <p className="font-medium mb-2">Existing Images :</p>
          <div className="flex gap-3 flex-wrap">
            {existingImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt="product"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW IMAGES */}
      <div className="mt-5">
        <label className="form-label">Product Images (Max 5) : </label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="form-input file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />
        {(existingImages.length + newImages.length) > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {existingImages.length + newImages.length} image(s) selected
          </p>
        )}

        {/* Preview new images */}
        {newImages.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-2">
            {newImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="new"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading
            ? "Saving..."
            : initialData
            ? "Update Product"
            : "Add Product"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
