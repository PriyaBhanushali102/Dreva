import { useState , useEffect} from "react";
import { CATEGORIES } from '../../utils/constants';
import {Select} from "../index";

function ProductFilter({ filters, onFilterChange, onClearFilters }) {
    const [localFilters, setLocalFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        q: "",
        ...filters
    });

    const handleChange = (field, value) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    }

    const handleClear = () => {
        const emptyFilters = { category: '', minPrice: '', maxPrice: '', q: '' };
        setLocalFilters(emptyFilters);
        onClearFilters();
    };

    useEffect(() => {
        setLocalFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            q: '',
            ...filters
        });
    }, [filters]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-20 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wider">Filters</h3>
                <button onClick={handleClear}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition">
                    Clear All
                </button>   
            </div>

            {/* Search */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Search
                </label>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={localFilters.q}
                    onChange={(e) => handleChange('q', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
            </div>

            {/* Category - using Select Component */}
            <Select label="Category"
                value={localFilters.category}
                onChange={(e) => handleChange('category', e.target.value)}
                options={CATEGORIES}
                placeholder="All Categories"
            />

            {/* Price Range */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Price Range
                </label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.minPrice}
                        onChange={(e) => handleChange('minPrice', e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.maxPrice}
                        onChange={(e) => handleChange('maxPrice', e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductFilter;