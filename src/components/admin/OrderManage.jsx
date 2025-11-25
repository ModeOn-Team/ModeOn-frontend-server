import { useEffect, useState } from "react";
import api from "../../lib/api";

function OrderManage() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await api.get("/api/admin/orders");
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/api/admin/orders/${id}/status`, { status });
    alert("상태가 변경되었습니다.");
    loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">주문 / 배송 관리</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>상품명</th>
            <th>수량</th>
            <th>총 가격</th>
            <th>현재 상태</th>
            <th>변경</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td>{o.productName}</td>
              <td>{o.count}</td>
              <td>{o.totalPrice.toLocaleString()}원</td>
              <td>{o.status}</td>

              <td className="space-x-2 py-2">
                <button
                  onClick={() => updateStatus(o.id, "SHIPPING")}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  배송중
                </button>
                <button
                  onClick={() => updateStatus(o.id, "DELIVERED")}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  배송완료
                </button>
                <button
                  onClick={() => updateStatus(o.id, "CANCEL")}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  취소
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManage;
