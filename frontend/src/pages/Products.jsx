import { ProductList, Container, MobileFilterModal, FilterSideBar } from "../components/index";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState} from "react";
import { FaFilter } from "react-icons/fa";

function Products() {
    const [searchParams] = useSearchParams();
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const filters = useMemo(() => ({
        q: searchParams.get("q") || searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        brand: searchParams.get("brand") || "",          
        minPrice: searchParams.get("minPrice") || "",    
        maxPrice: searchParams.get("maxPrice") || "",     
        sort: searchParams.get("sort") || "newest",
        limit: 12,
    }), [searchParams]);

    console.log("URL search =", searchParams.get("search"));

    return (
       
         <Container>
            <div className="py-6">

                {/* Page Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {filters.q ? (
                            <>Search Results for "{filters.q}"</>
                        ) : filters.category ? (
                            filters.category
                        ) : (
                            "All Products"
                        )}
                    </h1>
                    {filters.q && (
                        <p className="text-gray-600 text-sm">
                            {filters.category && `in ${filters.category}`}
                        </p>
                    )}

                    <button
                        onClick={() => setShowMobileFilter(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        <FaFilter size={14} />
                        Filters
                    </button>
                    </div>
                </div>
                
                {/* Main Content - Sidebar + Products Grid */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar - Desktop Only */}
                    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                        <FilterSideBar />
                    </aside>

                    {/* Products Grid - Main Content */}
                    <main className="flex-1 min-w-0">
                        <ProductList filters={filters} />
                    </main>
                </div>

                {/* Mobile Filter Modal */}
                <MobileFilterModal 
                    isOpen={showMobileFilter} 
                    onClose={() => setShowMobileFilter(false)} 
                />
            </div>
        </Container>
    )
}

export default Products;