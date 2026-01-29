import { FaStar } from 'react-icons/fa'

function ReviewCard({ review }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            {/* Raating */}
            <div className='flex items-center gap-2 mb-3'>
                <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                        />
                    ))}
                </div>
                <span className="font-semibold text-gray-800">{review.rating}</span>
            </div>

            {/* Comment */}
            <p className='text-gray-700 mb-3'>{review.comment}</p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className='flex gap-2 mb-3'>
                    {review.images.map((img, index) => (
                        <img
                            key={index}
                            src={img.url}
                            alt='Review'
                            className='w-20 h-20 object-cover rounded border border-gray-200'
                        />
                    ))}
                </div>
            )}

            {/* Usere Info */}
            <div className='text-sm text-gary-500 border-t border-gray-200 pt-3'>
                <span className='font-semibold text-gray-700'>{review.userId?.name || 'Anonymous'}</span>
                <span className='mx-2'>•</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}

export default ReviewCard;