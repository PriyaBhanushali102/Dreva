import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import {Input, Button} from "../index"
function SimpleSearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || searchParams.get("search") || ""
  );

  // Sync with URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || searchParams.get("search") || "");
  }, [searchParams]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
      <div className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products, brands and more..."
          className="w-full px-4 py-2.5 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-700 transition-all"
        />
        
        {/* Search Button */}
        <Button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-blue-400 transition"
          aria-label="Search"
        >
          <FaSearch className="text-lg" />
        </Button>
      </div>
    </form>
  );
}

export default SimpleSearchBar;