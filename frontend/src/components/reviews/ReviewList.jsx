import ReviewCard from "./ReviewCard";

function ReviewList({ reviews = []}) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
        return (
            <div>
                <p>
                    No reviews yet, Be the first to review!
                </p>
            </div>
        );
    }

    return (
        <div>
            {reviews
                .filter(Boolean)
                .map((review) => (
                <ReviewCard key={review._id} review={review} />
            ))}
        </div>

    );
}

export default ReviewList;