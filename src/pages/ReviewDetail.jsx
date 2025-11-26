import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function ReviewDetail() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const buildUrl = (base, path) =>
    base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/reviews/${reviewId}`);
        setReview(res.data);
      } catch (err) {
        console.error(err);
        alert("리뷰 정보를 불러오는 데 실패했습니다.");
      }
    };
    load();
  }, [reviewId]);

  if (!review) return null;

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-16 space-y-10">
        <h2 className="text-3xl font-semibold">리뷰 상세</h2>

        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm space-y-8">
          <div>
            <h3 className="text-xl font-medium">{review.productName}</h3>
            <p className="text-gray-400 text-sm">{review.createdAt} 작성</p>
          </div>

          <div className="text-black text-xl">
            {"⭐".repeat(review.rating)}
          </div>

          <p className="text-gray-700 whitespace-pre-line">{review.content}</p>

          {review.imageUrls && review.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {review.imageUrls.map((img, idx) => (
                <img
                  key={idx}
                  src={buildUrl(API_URL, img)}
                  className="w-48 h-48 rounded-xl object-cover shadow-sm"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 border rounded-lg">
            뒤로가기
          </button>

          <button onClick={() => navigate(`/review/edit/${review.id}`)} className="px-5 py-2.5 border rounded-lg">
            수정하기
          </button>

          <button
            onClick={async () => {
              if (!confirm("정말 삭제하시겠습니까?")) return;

              try {
                await api.delete(`/api/reviews/${review.id}`);
                alert("리뷰가 삭제되었습니다.");
                navigate("/mypage?tab=orders");

              } catch {
                alert("삭제 실패!");
              }
            }}
            className="px-5 py-2.5 border rounded-lg"
          >
            삭제하기
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default ReviewDetail;
