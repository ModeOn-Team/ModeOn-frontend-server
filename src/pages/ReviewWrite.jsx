import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function ReviewWrite() {
    
    const { historyId } = useParams();

    
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return alert("리뷰 내용을 입력해주세요!");

    try {
      await api.post(`/api/reviews/${historyId}`, {
        rating,
        content,
      });

      alert("리뷰가 작성되었습니다!");
      navigate(`/orders/${historyId}`);
    } catch (err) {
      console.error(err);
      alert("리뷰 작성에 실패했습니다.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-14 space-y-8">

        <h2 className="text-2xl font-bold">리뷰 작성</h2>

        {/* 별점 */}
        <div className="flex items-center gap-3">
          <span className="font-medium">별점:</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border px-3 py-2 rounded-lg"
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star}점
              </option>
            ))}
          </select>
        </div>

        {/* 내용 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 입력해주세요"
          className="w-full h-40 border p-4 rounded-xl"
        />

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            리뷰 등록
          </button>

          <button
            onClick={() => navigate(-1)}
            className="border px-6 py-3 rounded-xl hover:bg-gray-100"
          >
            취소
          </button>
        </div>

      </div>
    </MainLayout>
  );
}

export default ReviewWrite;
