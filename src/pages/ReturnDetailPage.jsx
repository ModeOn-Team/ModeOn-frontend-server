import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { historyService } from "../services/historyService";
import MainLayout from "../components/layout/MainLayout";

export default function ReturnDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const buildUrl = (base, path) =>
    base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await historyService.getHistoryDetail(id);
    setInfo(data);
  };

  if (!info) return null;

  const statusBadge = {
    REFUND_REQUEST: { label: "환불 요청 진행중", color: "bg-yellow-500" },
    REFUND_APPROVED: { label: "환불 승인됨", color: "bg-green-600" },
    REFUND_REJECTED: { label: "환불 거절됨", color: "bg-red-500" },
    EXCHANGE_REQUEST: { label: "교환 요청 진행중", color: "bg-yellow-500" },
    EXCHANGE_APPROVED: { label: "교환 승인됨", color: "bg-green-600" },
    EXCHANGE_REJECTED: { label: "교환 거절됨", color: "bg-red-500" },
  };

  const badge = statusBadge[info.requestStatus];

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-16 space-y-10">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate("/mypage?tab=returns")}
          className="text-sm text-gray-500 underline"
        >
          ← 취소/반품/교환 목록으로
        </button>

        <h2 className="text-3xl font-bold">취소 / 반품 / 교환 상세</h2>

        {/* 요청 상태  */}
        <span
          className={`inline-block px-3 py-1 text-xs text-white rounded-full ${badge.color}`}
        >
          {badge.label}
        </span>

        {/* 관리자 답변 */}
        {info.adminResponseReason && (
          <div className="px-4 py-3 border rounded-xl bg-gray-50 text-sm text-gray-700">
            <strong>관리자 답변:</strong> {info.adminResponseReason}
          </div>
        )}

        {/* 상품  */}
        <div
          className="bg-white p-6 rounded-3xl border shadow flex gap-8 cursor-pointer"
          onClick={() => navigate(`/product/${info.productId}`)}
        >
          <img
            src={
              info.productImage
                ? buildUrl(API_URL, info.productImage)
                : "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"
            }
            alt={info.productName}
            className="w-32 h-32 object-cover rounded-xl border"
          />

          <div className="flex flex-col justify-between py-1">
            <div>
              <h3 className="text-xl font-semibold">{info.productName}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {info.createdAt} 구매
              </p>
            </div>

            <div className="text-sm text-gray-700">
              {info.size && info.color && (
                <p>옵션: {info.size} / {info.color}</p>
              )}
              <p>수량: {info.count}개</p>
              <p className="text-xl font-bold mt-2">
                {info.totalPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        {/* 요청 사유 */}
        <div className="bg-white p-6 rounded-3xl border shadow space-y-3">
          <h3 className="text-lg font-semibold">요청 사유</h3>
          <p className="text-sm text-gray-700">{info.requestReason}</p>
        </div>

        {/* 이미지 */}
        <div className="bg-white p-6 rounded-3xl border shadow space-y-4">
          <h3 className="text-lg font-semibold">첨부 이미지</h3>

          {info.requestImages && info.requestImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {info.requestImages.map((img, idx) => (
                <img
                  key={idx}
                  src={buildUrl(API_URL, img)}
                  className="w-full h-32 object-cover rounded-xl border"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">첨부 이미지 없음</p>
          )}
        </div>


        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate("/mypage?tab=returns")}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            목록으로
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            홈으로
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
