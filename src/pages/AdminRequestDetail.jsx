import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminRequestService } from "../services/adminRequestService";

export default function AdminRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const buildUrl = (base, path) =>
    base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    const data = await adminRequestService.getDetail(id);
    setInfo(data);
  };

  const handleDecision = async (action) => {
    const reason = prompt("관리자 사유를 입력하세요:");
    if (!reason) return;

    const type = info.requestStatus.startsWith("REFUND")
      ? "refund"
      : "exchange";

    if (action === "approve") {
      await adminRequestService.approve(id, type, reason);
    } else {
      await adminRequestService.reject(id, type, reason);
    }

    alert("처리되었습니다.");


    navigate("/modeon-admin1101?tab=requests");
  };

  if (!info) return null;

  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow border max-w-4xl mx-auto mt-10">
      <button
        onClick={() => navigate("/modeon-admin1101?tab=requests")}
        className="text-sm text-gray-500 underline mb-4"
      >
        ← 요청 목록으로 돌아가기
      </button>

      <h2 className="text-2xl font-bold">요청 상세 정보</h2>

      <div className="space-y-2">
        <p><span className="font-semibold">상품명:</span> {info.productName}</p>
        <p><span className="font-semibold">요청자:</span> {info.username}</p>
        <p>
          <span className="font-semibold">요청 유형:</span>{" "}
          {info.requestStatus === "REFUND_REQUEST" ? "환불 요청" : "교환 요청"}
        </p>
        <p>
          <span className="font-semibold">요청 사유:</span>
          <br />
          <span className="text-gray-700">{info.requestReason}</span>
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">사용자 첨부 이미지</h3>
        {info.requestImages && info.requestImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {info.requestImages.map((img, idx) => (
              <div key={idx}>
                <img
                  src={buildUrl(API_URL, img)}
                  className="w-full h-40 object-cover rounded-lg border shadow-sm"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">첨부된 이미지 없음</p>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleDecision("approve")}
          className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
        >
          승인하기
        </button>
        <button
          onClick={() => handleDecision("reject")}
          className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600"
        >
          거절하기
        </button>
      </div>
    </div>
  );
}
