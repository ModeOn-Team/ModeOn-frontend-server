import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import MainLayout from "../components/layout/MainLayout";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) return;

  
    if (sessionStorage.getItem("payment_confirmed")) return;
    sessionStorage.setItem("payment_confirmed", "true");

    const confirmPayment = async () => {
      try {
        await api.post("/api/payment/confirm", {
          paymentKey,
          orderId,
          amount: Number(amount),
        });
      } catch (err) {
        console.error("결제 승인 실패:", err);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-28">
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
