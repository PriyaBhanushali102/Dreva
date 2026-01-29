import { ProductList, Container } from "../components/index";
import { useSearchParams } from "react-router-dom";

function Products() {
    const [searchParams] = useSearchParams();

    const filters = {
        category: searchParams.get("category") || "",
        q: searchParams.get("q") || "",
        sort: searchParams.get("sort") || "newest",
    };

    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8">{filters.category ? `${filters.category} ` : "All Products"}</h1>
                <div className="lg:col-span-3">
                    <ProductList filters={filters}/>
                </div>
            </div>
        </Container>
    )
}

export default Products;