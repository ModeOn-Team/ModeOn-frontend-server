import { useEffect, useState } from "react";
import api from "../../lib/api";

function AdminRequestList() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null); 
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get("/api/admin/history/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("요청 목록을 불러오지 못했습니다.");
    }
  };

  // 승인
  const approve = async () => {
    if (!reason.trim()) return alert("사유를 입력하세요.");

    const type =
      selected.requestStatus === "REFUND_REQUEST" ? "refund" : "exchange";

    const url = `/api/admin/history/${selected.id}/${type}/approve`;

    await api.patch(url, { reason });
    alert("승인 완료");
    closeModal();
    loadRequests();
  };

  // 거절
  const reject = async () => {
    if (!reason.trim()) return alert("사유를 입력하세요.");

    const type =
      selected.requestStatus === "REFUND_REQUEST" ? "refund" : "exchange";

    const url = `/api/admin/history/${selected.id}/${type}/reject`;

    await api.patch(url, { reason });
    alert("거절 완료");
    closeModal();
    loadRequests();
  };

  const openModal = (request) => {
    setSelected(request);
    setReason("");
  };

  const closeModal = () => {
    setSelected(null);
    setReason("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">교환 / 환불 요청 관리</h2>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b">
            <th className="p-4">ID</th>
            <th className="p-4">상품명</th>
            <th className="p-4">유저명</th>
            <th className="p-4">요청 종류</th>
            <th className="p-4">사유</th>
            <th className="p-4">요청일</th>
            <th className="p-4">관리</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{r.id}</td>
              <td className="p-4">{r.productName}</td>
              <td className="p-4">{r.username}</td>
              <td className="p-4">
                {r.requestStatus === "REFUND_REQUEST" ? "환불" : "교환"}
              </td>
              <td className="p-4">{r.requestReason}</td>
              <td className="p-4">{r.createdAt}</td>

              <td className="p-4 flex gap-2">
                <button
                  onClick={() => openModal(r)}
                  className="bg-black text-white px-3 py-2 rounded"
                >
                  처리하기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 모달 */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-lg">

            <h2 className="font-semibold text-lg">결정 사유 입력</h2>

            <input
              className="border w-full p-2 rounded"
              placeholder="관리자 사유 입력"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <button
                onClick={approve}
                className="bg-green-600 text-white py-2 rounded"
              >
                승인
              </button>
              <button
                onClick={reject}
                className="bg-red-600 text-white py-2 rounded"
              >
                거절
              </button>
              <button
                onClick={closeModal}
                className="border py-2 rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequestList;
