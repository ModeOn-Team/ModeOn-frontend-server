import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function ReviewEdit() {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const [oldImages, setOldImages] = useState([]); // 기존 이미지 URL
  const [newImages, setNewImages] = useState([]); // 새 이미지 file
  const [newPreviews, setNewPreviews] = useState([]); // 새 이미지 미리보기

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const buildUrl = (base, path) =>
    base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");


  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/reviews/${reviewId}`);
        const r = res.data;

        setRating(r.rating);
        setContent(r.content);
        setOldImages(r.imageUrls || []);
      } catch (err) {
        console.error(err);
        alert("리뷰 정보를 불러오는데 실패했습니다.");
      }
    };
    load();
  }, [reviewId]);

  /** 새 이미지 추가 */
  const handleNewFiles = (e) => {
    const files = Array.from(e.target.files);

    const merged = [...newImages, ...files];
    setNewImages(merged);

    setNewPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  /** 기존 이미지 X 삭제 */
  const removeOldImage = (index) => {
    setOldImages(oldImages.filter((_, i) => i !== index));
  };

  /** 새 이미지 X 삭제 */
  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  /** 제출 */
  const handleSubmit = async () => {
    if (!content.trim()) return alert("내용을 입력해주세요.");

    try {
      const formData = new FormData();

      formData.append(
        "request",
        new Blob(
          [
            JSON.stringify({
              rating,
              content,
              imageUrls: oldImages, // 남길 기존 이미지들
            }),
          ],
          { type: "application/json" }
        )
      );
      
      // 새 이미지 업로드
      newImages.forEach((img) => formData.append("images", img));


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

        {/* 별점 */}
        <div className="flex items-center gap-3">
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
          className="w-full h-40 border p-4 rounded-xl"
        />

        {/* 기존 이미지 */}
        <div>
          <p className="font-medium mb-2">기존 이미지</p>
          <div className="flex flex-wrap gap-4">
            {oldImages.length === 0 && (
              <p className="text-gray-500 text-sm">기존 이미지 없음</p>
            )}

            {oldImages.map((img, idx) => (
              <div key={idx} className="relative w-32 h-32">
                <img
                  src={buildUrl(API_URL, img)}
                  className="w-full h-full rounded-xl object-cover border"
                />
                <button
                  onClick={() => removeOldImage(idx)}
                  className="absolute -top-2 -right-2 bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 새 이미지 */}
        <div>
          <p className="font-medium mb-2">새 이미지 추가</p>
          <div className="flex flex-wrap gap-4">
            {/* + 버튼 */}
            <label className="w-32 h-32 border rounded-xl flex items-center justify-center text-3xl cursor-pointer bg-gray-100 hover:bg-gray-200">
              +
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewFiles}
                className="hidden"
              />
            </label>

            {/* 새 미리보기 */}
            {newPreviews.map((src, idx) => (
              <div key={idx} className="relative w-32 h-32">
                <img
                  src={src}
                  className="w-full h-full rounded-xl object-cover border"
                />
                <button
                  onClick={() => removeNewImage(idx)}
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
            수정 완료
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

export default ReviewEdit;
