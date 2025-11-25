import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function ReviewEdit() {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/reviews/${reviewId}`);
        setRating(res.data.rating);
        setContent(res.data.content);

        if (res.data.imageUrl) {
          setPreview(`${API_URL}/${res.data.imageUrl}`);
        }
      } catch (err) {
        console.error(err);
        alert("리뷰 정보를 불러오지 못했습니다.");
      }
    };
    load();
  }, [reviewId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!content.trim()) return alert("내용을 입력해주세요.");

    try {
      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify({ rating, content })], {
          type: "application/json",
        })
      );

      if (image) formData.append("image", image);

      await api.put(`/api/reviews/${reviewId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("리뷰가 수정되었습니다!");
      navigate(`/review/${reviewId}`);
    } catch (err) {
      console.error(err);
      alert("수정 실패!");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-14 space-y-8">
        <h2 className="text-2xl font-bold">리뷰 수정</h2>

        <div className="flex items-center gap-3">
          <span className="font-medium">별점:</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border px-4 py-2 rounded-xl bg-white shadow-sm"
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star}점
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 border p-4 rounded-xl bg-white shadow-sm"
        />

        {/* 이미지 수정 */}
        <div>
          <label className="font-medium">이미지 변경:</label>
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

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleUpdate}
            className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-900 transition"
          >
            수정 완료
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            취소
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default ReviewEdit;
