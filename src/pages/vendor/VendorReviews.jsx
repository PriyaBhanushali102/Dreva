import { Container, ReviewCard, Loader } from "../../components";
import { useState, useEffect } from "react";
import * as authService from "../../services/authService";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

function VendorReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        average: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await authService.getVendorReviews();
                const reviewsData = response.data.data || [];
                setReviews(reviewsData);

                // Calculate stats
                const total = reviewsData.length;
                const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
                const average = total > 0 ? (sum / total).toFixed(1) : 0;

                const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                reviewsData.forEach((r) => {
                    distribution[r.rating]++;
                });

                setStats({ total, average, distribution })
            } catch (error) {
                toast.error("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, []);

    if (loading) return <Loader />
    
    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Customer Reviews
                </h1>

                {/* Stats Overview */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Average Rating */}
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-600 mb-2">
                                {stats.average}
                            </div>
                            <div className="flex justify-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                        i < Math.floor(stats.average) ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"
                                    }
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600">Average Rating</p>
                        </div>

                        {/* Total Reviews */}
                        <div className="text-center">
                            <div className="text-5xl font-bold text-green-600 mb-2">
                                {stats.total}
                            </div>
                            <p className="text-gray-600">Total Reviews</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex text-center gap-2">
                                    <span className="text-sm w-12">{rating} star</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    stats.total > 0
                                                    ? (stats.distribution[rating] / stats.total) * 100
                                                    : 0
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span  className="text-sm text-gray-600 w-8">
                                        {stats.distribution[rating]}
                                    </span>             
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600">No reviews yet</p>
                    </div>
                ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white p-6 rounded-lg shadow">
                                    <div className="flex items-start gap-4">
                                        {/* Use img */}
                                        <img
                                            src={review.user?.image?.url || "/placeholder.jpg"}
                                            alt={review.user?.name || "User"}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />

                                        <div className="flex-1">
                                            {/* user info */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {review.user?.name || "Anonymous"}
                                                    </p>
                                                    <p  className="text-sm text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString('en-IN')}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className={
                                                                i < review.rating
                                                                    ? "text-yellow-400"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Product Name */}
                                            <p className="text-sm text-gray-600 mb-2">
                                                Product: <span className="font-medium">{review.product?.name}</span>
                                            </p>
                                            
                                            {/* Review Comment */}
                                            <p className="text-gray-700 mb-3">{review.comment}</p>
                                            
                                            {/* Review Images */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2">
                                                    {review.images.map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={img.url}
                                                            alt={`Review ${idx + 1}`}
                                                            className="w-20 h-20 object-cover rounded border"
                                                        />
                                                    ))}
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                )}
            </div>
        </Container>
    )
}

export default VendorReviews;
