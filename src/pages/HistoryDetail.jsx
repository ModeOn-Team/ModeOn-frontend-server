import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { historyService } from "../services/historyService";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

function HistoryDetail() {
  const { id } = useParams(); // historyId
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
      } catch (err) {
        setReview(null);
      }
    };
    load();
  }, [id]);

  if (!info) return null;

  const currentStatus = info.status?.toUpperCase() || "PAID";
  const statusSteps = ["PAID", "PREPARING", "SHIPPING", "DELIVERED"];

  const progressWidth =
    currentStatus === "PREPARING"
      ? "33%"
      : currentStatus === "SHIPPING"
      ? "66%"
      : currentStatus === "DELIVERED"
      ? "100%"
      : "0%";

  const stepNames = {
    PAID: "결제 완료",
    PREPARING: "배송 준비중",
    SHIPPING: "배송중",
    DELIVERED: "배송 완료",
  };
  
  // ✅ 상품 상세 페이지로 이동
  const goProductDetail = () => {
    if (!info.productId) {
      console.warn("productId 없음");
      return;
    }
    navigate(`/product/${info.productId}`);
  };

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-16 space-y-10">
        <h2 className="text-2xl font-bold">주문 상세 내역</h2>

        {/* 상품 정보 카드 */}
        <div
          className="bg-white p-8 rounded-2xl shadow-sm border flex gap-8 cursor-pointer hover:shadow-md transition"
          onClick={goProductDetail}
        >
          <img
            src={
              info.productImage ||
              "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"
            }
            alt={info.productName}
            className="w-48 h-48 rounded-xl object-cover border hover:scale-105 transition"
          />

          <div className="flex flex-col justify-between py-2">
            <div>
              <h3 className="text-xl font-semibold hover:underline">
                {info.productName}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{info.createdAt} 구매</p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">수량 : {info.count}개</p>
              <p className="text-2xl font-bold">
                {info.totalPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        {/* 배송 진행 상태 타임라인 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">배송 진행 상태</h3>

          <div className="flex items-center justify-between text-sm font-medium">
            {statusSteps.map((step, index) => {
              const isActive = statusSteps.indexOf(currentStatus) >= index;

              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-5 h-5 rounded-full mb-2 ${
                      isActive ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>

                  <span
                    className={
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-gray-400"
                    }
                  >
                    {stepNames[step]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="relative mt-4 h-1 bg-gray-300 rounded">
            <div
              className="absolute top-0 left-0 h-1 bg-blue-600 rounded"
              style={{ width: progressWidth }}
            ></div>
          </div>

          {/* 배송 단계 날짜 */}
          <div className="mt-6 space-y-2 text-sm">
            <p>
              <strong>결제 완료:</strong> {info.createdAt || "-"}
            </p>
            <p>
              <strong>배송 시작:</strong> {info.shippedAt || "-"}
            </p>
            <p>
              <strong>배송 완료:</strong> {info.deliveredAt || "-"}
            </p>
          </div>
        </div>

        {/* 배송 정보 상세 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-3">
          <h3 className="text-lg font-semibold">배송 정보</h3>

          <p className="text-sm">
            <strong>배송 상태:</strong>{" "}
            <span className="text-blue-600 font-semibold">{info.status}</span>
          </p>

          {info.trackingNumber && (
            <p className="text-sm">
              <strong>운송장 번호:</strong> {info.trackingNumber}
            </p>
          )}

          {info.courierCode && (
            <p className="text-sm">
              <strong>택배사:</strong> {info.courierCode}
            </p>
          )}

          {info.shippedAt && (
            <p className="text-sm">
              <strong>배송 시작:</strong> {info.shippedAt}
            </p>
          )}

          {info.deliveredAt && (
            <p className="text-sm">
              <strong>배송 완료:</strong> {info.deliveredAt}
            </p>
          )}
        </div>

        {/* 리뷰 관련 */}
        <div className="space-y-4">
          {review ? (
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/review/${review.id}`)}
                className="border px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                리뷰 보기
              </button>

              <button
                onClick={() => navigate(`/review/edit/${review.id}`)}
                className="border px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                리뷰 수정
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/review/write/${id}`)}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              리뷰 작성하기
            </button>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/orders")}
            className="border border-gray-400 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            주문내역으로 돌아가기
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            홈으로
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default HistoryDetail;
