import { useProducts } from "../../hooks/useProducts";
import { ProductCard, Loader, Button } from "../index";
function ProductList({ filters }) {
  const {
    products,
    loading,
    page,
    total,
    setPage,
    fetchProducts,
  } = useProducts(filters);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchProducts(newPage);
    window.scrollTo({ top:0, behavior: 'smooth'})
  };

  if (loading) return <Loader fullScreen={false} />;

  if (!products.length) {
    return <p className="text-gray-500">No products found.</p>;
  }

  const totalPages = Math.ceil(total / filters.limit);
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow">
        {products.map((p) => (
            <ProductCard key={p._id} product={p} compact={true} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex w-full items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            page === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Previous
        </Button>

        <div>
          <span className="text-gray-600">
          Page {page} of {totalPages}
          </span>
          {total && (
            <span className="text-gray-500 text-sm m-1">
              ({total} items)
            </span>
          )}
        </div>
        
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            page >= totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Next
        </Button>
      </div>
    </>
  );
}

export default ProductList;
