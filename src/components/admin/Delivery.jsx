import { useState } from "react";
import { historyService } from "../../services/historyService";

const Delivery = () => {
  const [historyId, setHistoryId] = useState("");
  const [status, setStatus] = useState("PREPARING");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierCode, setCourierCode] = useState("");

  const handleSubmit = async () => {
    if (!historyId) {
      alert("주문번호(historyId)를 입력하세요.");
      return;
    }

    try {
      await historyService.updateStatus(historyId, {
        status,
        trackingNumber,
        courierCode,
      });

      alert("배송 상태가 변경되었습니다.");
      setTrackingNumber("");
      setCourierCode("");
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6 max-w-xl">

      <h2 className="text-2xl font-bold mb-4">배송 상태 관리</h2>

      {/* 주문 번호 입력 */}
      <div>
        <label className="text-sm font-semibold">주문 번호(History ID)</label>
        <input
          value={historyId}
          onChange={(e) => setHistoryId(e.target.value)}
          placeholder="예: 12"
          className="border p-2 w-full rounded mt-1"
        />
      </div>

      {/* 배송 상태 선택 */}
      <div>
        <label className="text-sm font-semibold">배송 상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full rounded mt-1"
        >
          <option value="PREPARING">배송 준비중</option>
          <option value="SHIPPING">배송중</option>
          <option value="DELIVERED">배송 완료</option>
        </select>
      </div>

      {/* 운송장 번호 */}
      <div>
        <label className="text-sm font-semibold">운송장 번호</label>
        <input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="예: 1234567890"
          className="border p-2 w-full rounded mt-1"
        />
      </div>

      {/* 택배사 코드 */}
      <div>
        <label className="text-sm font-semibold">택배사 코드</label>
        <input
          value={courierCode}
          onChange={(e) => setCourierCode(e.target.value)}
          placeholder="예: cj, hanjin"
          className="border p-2 w-full rounded mt-1"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white w-full py-3 rounded mt-5 hover:bg-gray-800"
      >
        배송 정보 저장
      </button>
    </div>
  );
};

export default Delivery;
