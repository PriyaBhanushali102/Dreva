import { Container, ProductForm, Loader } from "../../components";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as productService from "../../services/productService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isVendor } = useSelector((state) => state.auth);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isVendor) {
            toast.error("Vendor login required");
            navigate("/login");
        }
    }, [isVendor, navigate]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productService.getProductById(id);
                setProduct(response.data.data);
            } catch {
                toast.error("Failed to load product");
                navigate("/vendor/products");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleSubmit = async (formData) => {
        try {
            await productService.updateProduct(id, formData);
            toast.success("Product updated successfully");
            navigate("/vendor/products");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    }

    const handleCancel = () => {
        navigate("/vendor/products");
    }

    if (loading) return <Loader />
    
    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Edit Product
                </h1>
                <ProductForm
                    initialData={product}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </Container>
    )
}


export default EditProduct;