import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function ReviewWrite() {
  const { historyId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const [images, setImages] = useState([]);       // 파일들
  const [previews, setPreviews] = useState([]);   // 미리보기 URL

  /** 파일 추가 (+ 버튼) */
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const merged = [...images, ...files];

    setImages(merged);
    setPreviews(merged.map((file) => URL.createObjectURL(file)));
  };

  /** 이미지 개별 삭제 (X 버튼) */
  const removeImage = (index) => {
    const newFiles = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newFiles);
    setPreviews(newPreviews);
  };

  /** 리뷰 제출 */
  const handleSubmit = async () => {
    if (!content.trim()) return alert("리뷰 내용을 입력해주세요!");

    try {
      //  리뷰 먼저 작성
      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify({ rating, content })], {
          type: "application/json",
        })
      );

      images.forEach((img) => {
        formData.append("images", img);
      });

      await api.post(`/api/reviews/${historyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      const reviewRes = await api.get(`/api/reviews/history/${historyId}`);
      const reviewId = reviewRes.data.id;

      // 내가 쓴 리뷰 상세 페이지로 이동
      navigate(`/review/${reviewId}`);
    } catch (err) {
      console.error(err);
      alert("리뷰 작성 실패!");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-14 space-y-8">
        <h2 className="text-2xl font-bold">리뷰 작성</h2>

        {/* 별점 */}
        <div className="flex gap-3 items-center">
          <span className="font-medium">별점</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border px-3 py-2 rounded-xl"
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s}점
              </option>
            ))}
          </select>
        </div>

        {/* 내용 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 입력해주세요"
          className="w-full h-40 border p-4 rounded-xl"
        />

        {/* 이미지 업로드 */}
        <div>
          <p className="font-medium mb-2">이미지 첨부</p>

          <div className="flex flex-wrap gap-4">
            {/* + 박스 */}
            <label className="w-32 h-32 border rounded-xl flex items-center justify-center text-3xl cursor-pointer bg-gray-100 hover:bg-gray-200">
              +
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>

            {/* 업로드된 미리보기들 */}
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-32 h-32">
                <img
                  src={src}
                  className="w-full h-full rounded-xl object-cover border"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
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
