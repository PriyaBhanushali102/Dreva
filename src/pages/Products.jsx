import { ProductList, Container } from "../components/index";

function Products() {
    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8">All Products</h1>
                <div className="lg:col-span-3">
                    <ProductList />
                </div>
            </div>
        </Container>
    )
}

export default Products;