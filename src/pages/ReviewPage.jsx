import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import { getUserReviews } from "../services/review.js";

function ReviewPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getUserReviews();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p className="text-gray-600">리뷰를 불러오는 중...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 font-semibold"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">내가 작성한 리뷰</h1>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">아직 작성한 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">
                    {review.productName}
                  </h3>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({review.rating}.0)
                  </span>
                </div>

                <h4 className="font-medium text-gray-800 mb-2">
                  {review.title}
                </h4>

                <p className="text-gray-700 leading-relaxed">
                  {review.content}
                </p>

                {review.image && (
                  <img
                    src={review.image}
                    alt="리뷰 이미지"
                    className="mt-4 w-full max-w-md rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ReviewPage;
