import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";

function Success() {
  const [params] = useSearchParams();

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await api.post("/payment/confirm", {
          paymentKey,
          orderId,
          amount: Number(amount),
        });
        alert("결제가 정상적으로 완료되었습니다 ");

      } catch (err) {
        console.error("결제 승인 실패:", err);
        alert("결제 승인 중 오류가 발생했습니다.");
      }
    };

    confirmPayment();
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>결제가 완료되었습니다 </h2>
      <p>주문 번호: {orderId}</p>
      <p>결제 금액: {Number(amount).toLocaleString()}원</p>
    </div>
  );
}

export default Success;
