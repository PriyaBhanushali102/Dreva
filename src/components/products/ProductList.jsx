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
  };

  if (loading) return <Loader fullScreen={false} />;

  if (!products.length) {
    return <p className="text-gray-500">No products found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
            <ProductCard key={p._id} product={p} compact={true} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <Button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        <span className="text-gray-600">
          Page {page} {total ? `• ${total} items` : ""}
        </span>

        <Button onClick={() => handlePageChange(page + 1)}>
          Next
        </Button>
      </div>
    </>
  );
}

export default ProductList;
