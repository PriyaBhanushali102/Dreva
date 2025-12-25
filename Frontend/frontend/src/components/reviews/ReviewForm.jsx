import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button, Loader, Input } from "../index";

function ReviewForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(null);
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment("");
    setRating(5);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
    >
      <h3 className="text-xl font-bold mb-5 text-gray-800">
        Write a Review
      </h3>

      {/* Rating */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Your Rating
        </label>

        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <FaStar
                  className={`text-2xl ${
                    ratingValue <= (hover || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            );
          })}

          <span className="ml-3 text-sm text-gray-600">
            {rating} / 5
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike? How was the quality, delivery, and overall experience?"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-400
                     transition resize-none"
          required
        />
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Upload Images (optional)
        </label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
        {images.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">{images.length} file(s) selected</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2"
      >
        {loading ? <Loader /> : "Submit Review"}
      </Button>
    </form>
  );
}

export default ReviewForm;
