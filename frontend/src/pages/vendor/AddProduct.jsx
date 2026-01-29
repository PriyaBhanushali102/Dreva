import { ProductForm , Container} from "../../components";

function AddProduct() {
    return (
        <div className="bg-gray-50 min-h-screen py-5">
            <Container>   
                <div className="max-w-4xl mx-auto">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Vendor Portal</h1>
                        <p className="text-gray-600">Fill in the details below to list your product on Dreva.</p>
                    </div>
                    <ProductForm onSuccess={(data) => console.log("Success:", data)} />
                </div>
            </Container>
        </div>
    )  
}

export default AddProduct;