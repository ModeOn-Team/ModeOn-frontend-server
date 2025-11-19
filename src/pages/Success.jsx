import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import MainLayout from "../components/layout/MainLayout";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [confirmStatus, setConfirmStatus] = useState("loading"); // loading, success, error

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setConfirmStatus("error");
      return;
    }

    // 주문별로 고유한 키 사용 (중복 처리 방지)
    const confirmKey = `payment_confirmed_${orderId}`;
    if (sessionStorage.getItem(confirmKey)) {
      setConfirmStatus("success");
      return;
    }

    const confirmPayment = async () => {
      try {
        await api.post("/api/payment/confirm", {
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        sessionStorage.setItem(confirmKey, "true");
        setConfirmStatus("success");

        // 장바구니 갱신 이벤트 발송
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (err) {
        setConfirmStatus("error");
        sessionStorage.removeItem(confirmKey);

        alert(
          "결제 승인 처리 중 오류가 발생했습니다.\n" +
          "고객센터로 문의해주세요.\n\n" +
          `주문번호: ${orderId}`
        );
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  // 로딩 중
  if (confirmStatus === "loading") {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-28">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
          <h2 className="text-xl font-semibold">결제 승인 처리 중...</h2>
          <p className="text-gray-500 mt-2">잠시만 기다려주세요.</p>
        </div>
      </MainLayout>
    );
  }

  // 에러 발생
  if (confirmStatus === "error") {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-28">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-4">결제 처리 오류</h2>
          <p className="text-gray-600 mb-8">
            결제 승인 처리 중 오류가 발생했습니다.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition"
            >
              다시 시도
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-gray-400 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              홈으로
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 성공
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-28">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-semibold mb-8">결제가 완료되었습니다.</h2>

        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center space-y-4">
          <div className="text-gray-600 text-sm">주문 번호</div>
          <div className="text-lg font-medium">{orderId}</div>

          <div className="text-gray-600 text-sm mt-4">결제 금액</div>
          <div className="text-3xl font-bold">
            {Number(amount).toLocaleString()}원
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            홈으로
          </button>

          <button
            onClick={() =>      navigate("/mypage?tab=orders")}
            className="border border-gray-400 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            주문내역 보기
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Success;
