import { Container, Button, Loader, ProductCard } from "../../components";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as productService from "../../services/productService";
import * as authService from "../../services/authService";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function VendorProducts() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,

    })

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await authService.getVendorProduct({ page, limit: 12 });
            setProducts(response.data.data || []);
            setPagination(response.data.pagination || pagination);
        } catch  {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
            fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.deleteProduct(id);
                toast.success("Product deleted successfully");
                fetchProducts(pagination.page);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete product")
            }
        }
    }

    if(loading) return <Loader/>

    return (
        <Container>
            <div className="py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">
                        My Products
                    </h1>
                    <Link to='/vendor/products/add'>
                        <Button className="flex items-center gap-2">
                            <FaPlus/> Add Product
                        </Button>
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600 mt-4">
                            You haven't added any products yet
                        </p>
                        <Link to="/vendor/products/add">
                            <Button>Add Your First Product</Button>
                        </Link>
                    </div>
                ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="bg-white rounded-lg shadow hover:shadpw-lg transition overflow-hidden">
                                        <img
                                            src={product.images?.[0]?.url || "/placeholder.jpg"}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <ProductCard key={product?._id} product={product} />
                                            <div className="flex gap-2">
                                            <Link to={`/vendor/products/${product._id}`} className="flex-1">
                                                <Button className="w-full flex items-center justify-center gap-2">
                                                    <FaEdit /> Edit
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="danger"
                                                onClick={() => handleDelete(product._id)}
                                                className="px-4"
                                            >
                                                <FaTrash />
                                            </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.page > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-8">
                                <Button
                                    onClick={() => fetchProducts(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-gray-700">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <Button
                                    onClick={() => fetchProducts(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.pages}
                                >
                                    Next
                                </Button>
                                </div>
                            )}
                        </>
                )}
            </div>
        </Container>

    )
}
export default VendorProducts;
