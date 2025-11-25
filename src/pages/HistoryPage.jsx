import { useEffect, useState } from "react";
import { historyService } from "../services/historyService";
import { useNavigate } from "react-router-dom";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    historyService.getHistory().then(setHistory);
  }, []);

  const statusBadge = {
    PAID: { label: "결제 완료", color: "bg-gray-500" },
    PREPARING: { label: "배송 준비중", color: "bg-yellow-500" },
    SHIPPING: { label: "배송중", color: "bg-blue-600" },
    DELIVERED: { label: "배송 완료", color: "bg-green-600" },
  };

  const requestStatusText = {
    REFUND_REQUEST: "환불 요청 진행중",
    REFUND_APPROVED: "환불 승인됨",
    REFUND_REJECTED: "환불 거절됨",
    EXCHANGE_REQUEST: "교환 요청 진행중",
    EXCHANGE_APPROVED: "교환 승인됨",
    EXCHANGE_REJECTED: "교환 거절됨",
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-4 space-y-10">
      <h1 className="text-2xl font-semibold">주문 내역</h1>

      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          아직 구매한 상품이 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => {
            const statusKey = (item.status || "PAID").toUpperCase();

            return (
              <div
                key={item.id}
                className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition"
              >
                <img
                  onClick={() => navigate(`/orders/${item.id}`)}
                  src={
                    item.productImage
                      ? API_URL + item.productImage
                      : "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"
                  }
                  alt={item.productName}
                  className="w-28 h-28 rounded-lg object-cover border cursor-pointer hover:scale-105 transition"
                />

                <div className="flex-1 space-y-2">
                  <h3
                    className="text-lg font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate(`/orders/${item.id}`)}
                  >
                    {item.productName}
                  </h3>

                  {item.size && item.color && (
                    <p className="text-gray-600 text-sm">
                      옵션: {item.size} / {item.color}
                    </p>
                  )}

                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold text-[15px]">
                      {item.totalPrice.toLocaleString()}원
                    </span>{" "}
                    · {item.count}개
                  </p>

                  <p className="text-xs text-gray-400">{item.createdAt} 구매</p>

                  <div className="mt-1">
                    <span className="text-gray-700 text-sm font-medium mr-2">
                      배송상태:
                    </span>
                    <span
                      className={`
                        px-2 py-1 rounded-full text-white text-xs font-semibold
                        ${statusBadge[statusKey]?.color || "bg-gray-500"}
                      `}
                    >
                      {statusBadge[statusKey]?.label || "결제 완료"}
                    </span>
                  </div>

                  {item.requestStatus && (
                    <p className="text-sm font-medium flex items-center gap-2 mt-1">
                      <span className="text-gray-700">요청상태:</span>
                      <span
                        className={`
                          px-2 py-1 rounded-full text-white text-xs
                          ${
                            item.requestStatus.includes("APPROVED")
                              ? "bg-green-600"
                              : item.requestStatus.includes("REJECTED")
                              ? "bg-red-600"
                              : "bg-yellow-600"
                          }
                        `}
                      >
                        {requestStatusText[item.requestStatus]}
                      </span>
                    </p>
                  )}

                  <div className="space-y-1 text-xs text-gray-500">
                    {item.trackingNumber && (
                      <p>운송장번호: {item.trackingNumber}</p>
                    )}
                    {item.courierCode && <p>택배사: {item.courierCode}</p>}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    {item.hasReview ? (
                      <button
                        onClick={() => navigate(`/review/${item.reviewId}`)}
                        className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50 transition"
                      >
                        리뷰 보기
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/review/write/${item.id}`)}
                        className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50 transition"
                      >
                        리뷰 쓰기
                      </button>
                    )}

                    {/* 🔥 교환/환불 버튼 조건 수정됨 */}
                    {statusKey === "DELIVERED" && !item.requestStatus && (
                      <button
                        onClick={() => navigate(`/orders/${item.id}/request`)}
                        className="px-3 py-1.5 rounded-lg border border-red-400 text-red-600 text-sm hover:bg-red-50 transition"
                      >
                        교환/환불
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between h-full">
                  <div className="font-bold text-lg text-gray-900">
                    {item.totalPrice.toLocaleString()}원
                  </div>

                  <button
                    onClick={() => navigate(`/orders/${item.id}`)}
                    className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-100 transition"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
