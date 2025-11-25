import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { historyService } from "../services/historyService";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await historyService.getHistoryDetail(id);
      setInfo(data);

      try {
        const reviewRes = await api.get(`/api/reviews/history/${id}`);
        setReview(reviewRes.data);
      } catch {
        setReview(null);
      }
    };

    load();
  }, [id]);

  if (!info) return null;

  const statusKorean = {
    PAID: "결제 완료",
    PREPARING: "배송 준비중",
    SHIPPING: "배송중",
    DELIVERED: "배송 완료",
  };

  const statusSteps = ["PAID", "PREPARING", "SHIPPING", "DELIVERED"];
  const statusKey = (info.status || "PAID").toUpperCase();

  const requestStatusText = {
    REFUND_REQUEST: "환불 요청 진행중",
    REFUND_APPROVED: "환불 승인됨",
    REFUND_REJECTED: "환불 거절됨",
    EXCHANGE_REQUEST: "교환 요청 진행중",
    EXCHANGE_APPROVED: "교환 승인됨",
    EXCHANGE_REJECTED: "교환 거절됨",
  };

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-16 space-y-10">
        <h2 className="text-3xl font-bold mb-4">주문 상세 내역</h2>

        {info.requestStatus && (
          <span className="inline-block px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-full bg-white">
            {requestStatusText[info.requestStatus]}
          </span>
        )}

        {info.adminResponseReason && (
          <div className="px-4 py-2 mt-2 text-sm text-gray-700 border border-gray-200 rounded-lg bg-gray-50">
            관리자 답변: {info.adminResponseReason}
          </div>
        )}

        {/* 상품 카드 */}
        <div
          onClick={() => navigate(`/product/${info.productId}`)}
          className="bg-white p-8 rounded-3xl border shadow hover:shadow-lg transition flex gap-8 cursor-pointer"
        >
          <img
            src={
              info.productImage ||
              "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"
            }
            alt={info.productName}
            className="w-40 h-40 rounded-xl object-cover border hover:scale-105 transition"
          />

          <div className="flex flex-col justify-between py-2">
            <div>
              <h3 className="text-2xl font-semibold hover:underline">
                {info.productName}
              </h3>
              <p className="text-gray-500 text-sm mt-2">{info.createdAt} 구매</p>
            </div>

            <div className="space-y-1">
              {info.size && info.color && (
                <p className="text-gray-600">옵션 : {info.size} / {info.color}</p>
              )}

              <p className="text-gray-600">수량 : {info.count}개</p>

              <p className="text-3xl font-bold text-gray-900">
                {info.totalPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        {/* 배송 진행 상태 */}
        <div className="bg-white p-8 rounded-3xl border shadow space-y-6">
          <h3 className="text-xl font-semibold">배송 진행 상태</h3>

          <div className="flex justify-between">
            {statusSteps.map((step, i) => {
              const active = statusSteps.indexOf(statusKey) >= i;

              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-5 h-5 rounded-full border mb-2 ${
                      active ? "bg-blue-600 border-blue-600" : "border-gray-300"
                    }`}
                  />
                  <span
                    className={`${
                      active ? "text-blue-600" : "text-gray-400"
                    } text-xs`}
                  >
                    {statusKorean[step]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="h-1 bg-gray-200 rounded relative">
            <div
              className="absolute left-0 top-0 h-1 bg-blue-600 rounded"
              style={{
                width:
                  statusKey === "PREPARING"
                    ? "33%"
                    : statusKey === "SHIPPING"
                    ? "66%"
                    : statusKey === "DELIVERED"
                    ? "100%"
                    : "0%",
              }}
            />
          </div>

          <div className="text-sm space-y-1 pt-2 text-gray-700">
            <p>
              <strong>결제 완료:</strong> {info.createdAt}
            </p>
            <p>
              <strong>배송 시작:</strong> {info.shippedAt || "-"}
            </p>
            <p>
              <strong>배송 완료:</strong> {info.deliveredAt || "-"}
            </p>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="bg-white p-8 rounded-3xl border shadow space-y-3">
          <h3 className="text-xl font-semibold">배송 정보</h3>

          {info.trackingNumber ? (
            <>
              <p className="text-sm">
                <strong>운송장 번호:</strong> {info.trackingNumber}
              </p>
              <p className="text-sm">
                <strong>택배사:</strong> {info.courierCode || "-"}
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-500">배송 정보가 없습니다.</p>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between items-center mt-10">
          <div>
            {review ? (
              <button
                onClick={() => navigate(`/review/${review.id}`)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                리뷰 보기
              </button>
            ) : (
              <button
                onClick={() => navigate(`/review/write/${id}`)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                리뷰 작성하기
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/orders")}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              주문내역으로 돌아가기
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HistoryDetail;
