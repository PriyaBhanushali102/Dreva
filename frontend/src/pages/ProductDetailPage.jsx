import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createReview } from "../services/reviewService";
import {Container, ProductDetail, ReviewList, ReviewForm , Button} from "../components/index";
import axios from "axios";
function ProductDetailPage() {
    const { id: prodId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/api/reviews/product/${prodId}?page=1&limit=12`);
                setReviews(res.data.data || []);
            } catch {
                toast.error("Failed to load reviews");
            }
        }
        fetchReviews();
    }, [prodId])

    const handleReviewSubmit = async ({ rating, comment, images = [] }) => {
        try {
            setLoading(true);
            const res = await createReview(prodId, { rating, comment, images });
             console.log("REVIEW RESPONSE:", res.data); // 🧪 debug

            if (!res.data?.review) {
                throw new Error("Review not returned from backend");
            }
            setReviews((prev) => [res.data.reviews, ...prev]);
            toast.success("Review submitted successfully")
        } catch {
            toast.error("Review submit failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <div className="py-8 space-y-8">
                {/* Product details */}
                <ProductDetail />

                {/* Review section */}
                <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Customer Review
                    </h2>

                    <div className="space-y-8 mt-6">
                        <ReviewList reviews={reviews} />
                    </div>

                    <Button
                        onClick={() => setShowReviewForm((prev) => !prev)}
                        className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
                    >
                        {showReviewForm ? "Cancel Review" : "Write a Review"}
                    </Button>
                    
                    
                    {showReviewForm && (
                        <div className="mt-6 border p-4 rounded shadow-sm bg-gray-50">
                            <ReviewForm onSubmit={handleReviewSubmit} loading={loading} />
                        </div>
                    )}
                   
                </div>
            </div>
        </Container>
    )
}

export default ProductDetailPage;