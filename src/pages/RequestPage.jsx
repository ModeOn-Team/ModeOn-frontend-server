import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import api from "../lib/api";

export default function RequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);

  // 선택 상태
  const [type, setType] = useState("REFUND"); // REFUND or EXCHANGE
  const [reasonType, setReasonType] = useState("단순 변심");
  const [reasonDetail, setReasonDetail] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/api/history/${id}`);
      setInfo(res.data);
    };
    load();
  }, [id]);

  if (!info) return null;

  const handleSubmit = async () => {
    if (!reasonDetail.trim()) return alert(" 상세 사유를 입력해주세요.");

    try {
      const endpoint = type === "REFUND"
        ? `/api/history/${id}/refund`
        : `/api/history/${id}/exchange`;

      await api.post(endpoint, {
        reason: `${reasonType} - ${reasonDetail}`
      });

      alert(type === "REFUND" ? "환불 요청 완료!" : "교환 요청 완료!");
      navigate("/orders");
    } catch {
      alert("요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-16 space-y-10">
        
        <h2 className="text-3xl font-bold">교환 / 환불 요청</h2>

        {/* 상품 정보 */}
        <div className="flex gap-6 bg-white border rounded-2xl p-6 shadow">
          <img
            src={info.productImage}
            alt={info.productName}
            className="w-28 h-28 object-cover rounded-xl border"
          />
          <div className="flex flex-col justify-between py-1">
            <p className="text-lg font-bold">{info.productName}</p>
            <p className="text-gray-500">{info.count}개</p>
            <p className="font-bold text-xl">
              {info.totalPrice.toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 유형 선택 */}
        <div className="bg-white border rounded-2xl p-6 shadow">
          <p className="font-semibold mb-3">요청 유형 선택</p>
          <div className="flex gap-4">
            <button
              onClick={() => setType("REFUND")}
              className={`
                px-5 py-2 rounded-lg border transition
                ${type === "REFUND" ? "bg-black text-white" : "bg-gray-100"}
              `}
            >
              환불 요청
            </button>

            <button
              onClick={() => setType("EXCHANGE")}
              className={`
                px-5 py-2 rounded-lg border transition
                ${type === "EXCHANGE" ? "bg-black text-white" : "bg-gray-100"}
              `}
            >
              교환 요청
            </button>
          </div>
        </div>

        {/* 사유 선택 */}
        <div className="bg-white border rounded-2xl p-6 shadow space-y-4">
          <p className="font-semibold">사유 선택</p>

          <select
            className="w-full border rounded-xl px-4 py-3"
            value={reasonType}
            onChange={(e) => setReasonType(e.target.value)}
          >
            <option>단순 변심</option>
            <option>사이즈가 맞지 않음</option>
            <option>상품 불량</option>
            <option>오배송</option>
            <option>기타</option>
          </select>

          <textarea
            placeholder="상세 사유를 작성해주세요"
            className="w-full border rounded-xl px-4 py-3 h-32"
            value={reasonDetail}
            onChange={(e) => setReasonDetail(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-xl text-lg hover:bg-gray-900 transition"
        >
          {type === "REFUND" ? "환불 요청 제출" : "교환 요청 제출"}
        </button>

        <button
          onClick={() => navigate(`/orders/${id}`)}
          className="block text-center text-gray-500 pt-4 underline"
        >
          뒤로가기
        </button>

      </div>
    </MainLayout>
  );
}
