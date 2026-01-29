import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";
import { Button } from "../index";

function MobileFilterModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
    sort: true,
  });

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  });

  const [brandSearch, setBrandSearch] = useState("");

  const categories = ["Home & Living", "Fashion", "Beauty", "Accessories"];
  const allBrands = ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levis", "Allen Solly"];
  const filteredBrands = allBrands.filter(brand => 
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "newest",
    });
  }, [searchParams]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (filters.category) {
      params.set("category", filters.category);
    } else {
      params.delete("category");
    }

    if (filters.brand) {
      params.set("brand", filters.brand);
    } else {
      params.delete("brand");
    }

    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice);
    } else {
      params.delete("minPrice");
    }

    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (filters.sort && filters.sort !== "newest") {
      params.set("sort", filters.sort);
    } else {
      params.delete("sort");
    }

    navigate(`/products?${params.toString()}`, { replace: true });
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    };
    setFilters(clearedFilters);
    
    const params = new URLSearchParams();
    const searchQuery = searchParams.get("search") || searchParams.get("q");
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    navigate(`/products?${params.toString()}`, { replace: true });
    onClose();
  };

  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    (filters.sort && filters.sort !== "newest");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 overflow-y-auto lg:hidden scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900 uppercase">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Clear All */}
        {hasActiveFilters && (
          <div className="px-4 py-3 border-b border-gray-200">
            <button
              onClick={handleClearFilters}
              className="text-sm font-medium text-red-500 hover:text-red-600 uppercase"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Category Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("category")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900 uppercase">Category</span>
            {openSections.category ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>
          
          {openSections.category && (
            <div className="px-4 pb-4 space-y-3">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.category === ""}
                  onChange={() => handleFilterChange("category", "")}
                  className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  All Categories
                </span>
              </label>

              {categories.map((cat) => (
                <label key={cat} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category === cat}
                    onChange={() => handleFilterChange("category", filters.category === cat ? "" : cat)}
                    className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brand Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("brand")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900 uppercase">Brand</span>
            {openSections.brand ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>
          
          {openSections.brand && (
            <div className="px-4 pb-4">
              <div className="relative mb-3">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search for Brand"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                {filteredBrands.map((brand) => (
                  <label key={brand} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.brand === brand}
                      onChange={() => handleFilterChange("brand", filters.brand === brand ? "" : brand)}
                      className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("price")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900 uppercase">Price</span>
            {openSections.price ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>
          
          {openSections.price && (
            <div className="px-4 pb-4">
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-pink-500"
                />
                <span className="flex items-center text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-3">
                {[
                  { label: "Under ₹500", min: 0, max: 500 },
                  { label: "₹500 - ₹1000", min: 500, max: 1000 },
                  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
                  { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
                  { label: "Above ₹5000", min: 5000, max: "" },
                ].map((range) => (
                  <label key={range.label} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={
                        filters.minPrice === String(range.min) && 
                        filters.maxPrice === String(range.max)
                      }
                      onChange={() => {
                        if (filters.minPrice === String(range.min) && filters.maxPrice === String(range.max)) {
                          handleFilterChange("minPrice", "");
                          handleFilterChange("maxPrice", "");
                        } else {
                          handleFilterChange("minPrice", String(range.min));
                          handleFilterChange("maxPrice", String(range.max));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort By Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection("sort")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <span className="text-sm font-bold text-gray-900 uppercase">Sort By</span>
            {openSections.sort ? (
              <FaChevronUp className="text-gray-500 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-500 text-xs" />
            )}
          </button>
          
          {openSections.sort && (
            <div className="px-4 pb-4 space-y-3">
              {[
                { value: "newest", label: "Newest First" },
                { value: "popularity", label: "Popularity" },
                { value: "price-desc", label: "Price: High to Low" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "name", label: "Name: A to Z" },
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={filters.sort === option.value}
                    onChange={() => handleFilterChange("sort", option.value)}
                    className="w-4 h-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Apply Button - Sticky at Bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <Button
            onClick={applyFilters}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}

export default MobileFilterModal;