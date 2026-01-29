import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import {Button} from "../index"
function FilterSideBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Collapsible sections state
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

  // Brand search
  const [brandSearch, setBrandSearch] = useState("");

  // Available categories
  const categories = ["Home & Living", "Fashion", "Beauty", "Accessories"];

  // Popular brands (you can expand this list)
  const allBrands = ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levis", "Allen Solly"];
  const filteredBrands = allBrands.filter(brand => 
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Sync with URL changes
  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "newest",
    });
  }, [searchParams]);

  // Toggle section
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Apply filters to URL
  const applyFilters = (filterData) => {
    const params = new URLSearchParams(searchParams);

    // Update filter params
    if (filterData.category) {
      params.set("category", filterData.category);
    } else {
      params.delete("category");
    }

    if (filterData.brand) {
      params.set("brand", filterData.brand);
    } else {
      params.delete("brand");
    }

    if (filterData.minPrice) {
      params.set("minPrice", filterData.minPrice);
    } else {
      params.delete("minPrice");
    }

    if (filterData.maxPrice) {
      params.set("maxPrice", filterData.maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (filterData.sort && filterData.sort !== "newest") {
      params.set("sort", filterData.sort);
    } else {
      params.delete("sort");
    }

    navigate(`/products?${params.toString()}`, { replace: true });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    };
    setFilters(clearedFilters);
    
    // Keep only the search query
    const params = new URLSearchParams();
    const searchQuery = searchParams.get("search") || searchParams.get("q");
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    navigate(`/products?${params.toString()}`, { replace: true });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    (filters.sort && filters.sort !== "newest");

  return (
    <div className="w-full lg:w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0 scrollbar-hide">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium text-red-500 hover:text-red-600 uppercase"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("category")}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="text-sm font-bold text-gray-900 uppercase">
            Category
          </span>
          {openSections.category ? (
            <FaChevronUp className="text-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="text-gray-500 text-xs" />
          )}
        </button>
        
        {openSections.category && (
          <div className="px-5 pb-4 space-y-3">
            {/* All Categories Option */}
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
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="text-sm font-bold text-gray-900 uppercase">
            Brand
          </span>
          {openSections.brand ? (
            <FaChevronUp className="text-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="text-gray-500 text-xs" />
          )}
        </button>
        
        {openSections.brand && (
          <div className="px-5 pb-4">
            {/* Search Brand */}
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

            {/* Brand List */}
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
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="text-sm font-bold text-gray-900 uppercase">
            Price
          </span>
          {openSections.price ? (
            <FaChevronUp className="text-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="text-gray-500 text-xs" />
          )}
        </button>
        
        {openSections.price && (
          <div className="px-5 pb-4">
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

            {/* Price Range Options */}
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
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="text-sm font-bold text-gray-900 uppercase">
            Sort By
          </span>
          {openSections.sort ? (
            <FaChevronUp className="text-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="text-gray-500 text-xs" />
          )}
        </button>
        
        {openSections.sort && (
          <div className="px-5 pb-4 space-y-3">
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
    </div>
  );
}

export default FilterSideBar;