import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function ReviewWrite() {
  const { historyId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);      // 이미지 파일
  const [preview, setPreview] = useState(null);  // 미리보기

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return alert("리뷰 내용을 입력해주세요!");

    try {
 
      const historyRes = await api.get(`/api/history/${historyId}`);
      const productId = historyRes.data.productId;


      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify({ rating, content })], {
          type: "application/json",
        })
      );

      if (image) formData.append("image", image);

      await api.post(`/api/reviews/${historyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("리뷰가 작성되었습니다!");
      navigate(`/product/${productId}`);
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

        {/* 이미지 업로드 */}
        <div>
          <label className="font-medium">이미지 첨부:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block mt-2"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 mt-4 rounded-xl object-cover border"
            />
          )}
        </div>

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
