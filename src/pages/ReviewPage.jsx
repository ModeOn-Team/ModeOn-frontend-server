import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import { reviewService } from "../services/reviewService.js";

function ReviewPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {

    const loadReviews = async () => {
      try {
        const list = await reviewService.getReviewsByUser();
        setReviews(list.content);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };

    loadReviews();
  }, []);

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
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border rounded-xl p-5 bg-white shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{r.userName}</span>
                  <span className="text-yellow-500 text-lg">
                    {"⭐".repeat(r.rating)}
                  </span>
                </div>

                <p className="text-gray-800 whitespace-pre-line">{r.content}</p>

                <p className="text-gray-400 text-xs mt-2">{r.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ReviewPage;
