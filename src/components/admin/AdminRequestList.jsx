import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

function AdminRequestList() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const res = await api.get("/api/admin/history/requests");
    setRequests(res.data);
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

              <td className="p-4">
                <button
                  onClick={() => navigate(`/admin/request/${r.id}`)}
                  className="bg-black text-white px-3 py-2 rounded"
                >
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRequestList;
