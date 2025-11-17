import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function ReviewDetail() {

  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);

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

        <h2 className="text-3xl font-semibold tracking-tight">리뷰 상세</h2>

        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm space-y-8">

          <div>
            <h3 className="text-xl font-medium">{review.productName}</h3>
            <p className="text-gray-400 text-sm mt-1">{review.createdAt} 작성</p>
          </div>

          <div className="text-black text-xl">
            {"⭐".repeat(review.rating)}
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
            {review.content}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            뒤로가기
          </button>

          <button
            onClick={() => navigate(`/review/edit/${review.id}`)}
            className="px-5 py-2.5 rounded-lg border border-gray-400 text-gray-800 hover:bg-gray-100 transition"
          >
            수정하기
          </button>

          <button
            onClick={async () => {
              if (!confirm("정말 삭제하시겠습니까?")) return;

              try {
                await api.delete(`/api/reviews/${review.id}`);
                alert("리뷰가 삭제되었습니다.");
                navigate("/orders");
              } catch (err) {
                console.error(err);
                alert("삭제 실패!");
              }
            }}
            className="px-5 py-2.5 rounded-lg border border-gray-400 text-gray-800 hover:bg-gray-100 transition"
          >
            삭제하기
          </button>

        </div>

      </div>
    </MainLayout>
  );
}

export default ReviewDetail;
