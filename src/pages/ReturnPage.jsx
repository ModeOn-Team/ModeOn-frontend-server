import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { historyService } from "../services/historyService";

export default function ReturnPage() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const buildUrl = (base, path) =>
    base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await historyService.getHistory();

    const filtered = data.filter((h) =>
      [
        "REFUND_REQUEST",
        "REFUND_APPROVED",
        "REFUND_REJECTED",
        "EXCHANGE_REQUEST",
        "EXCHANGE_APPROVED",
        "EXCHANGE_REJECTED",
      ].includes(h.requestStatus)
    );

    setList(filtered);
  };

  const statusBadge = {
    REFUND_REQUEST: { label: "환불 요청 진행중", color: "bg-yellow-500" },
    REFUND_APPROVED: { label: "환불 승인됨", color: "bg-green-600" },
    REFUND_REJECTED: { label: "환불 거절됨", color: "bg-red-500" },
    EXCHANGE_REQUEST: { label: "교환 요청 진행중", color: "bg-yellow-500" },
    EXCHANGE_APPROVED: { label: "교환 승인됨", color: "bg-green-600" },
    EXCHANGE_REJECTED: { label: "교환 거절됨", color: "bg-red-500" },
  };

  if (!list.length) {
    return (
      <div className="py-20 text-center text-gray-500">
        취소 / 반품 / 교환 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">취소 / 반품 / 교환 내역</h2>

      {list.map((item) => {
        const badge = statusBadge[item.requestStatus] || {
          label: item.requestStatus,
          color: "bg-gray-500",
        };

        return (
          <div
            key={item.id}
            className="flex gap-6 p-5 bg-white border rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/mypage/returns/${item.id}`)}
          >
            {/* 상품 */}
            <div className="w-28 h-28 flex-shrink-0">
              <img
                src={
                  item.productImage
                    ? buildUrl(API_URL, item.productImage)
                    : "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"
                }
                alt={item.productName}
                className="w-full h-full rounded-xl object-cover border"
              />
            </div>

           
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <p className="text-lg font-semibold">{item.productName}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.createdAt} 요청
                </p>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <span className="font-semibold">요청 사유: </span>
                <span>{item.requestReason || "-"}</span>
              </div>
            </div>

            <div className="flex items-center">
              <span
                className={`px-3 py-1.5 rounded-full text-xs text-white font-semibold ${badge.color}`}
              >
                {badge.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
