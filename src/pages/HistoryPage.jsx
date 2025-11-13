import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { historyService } from "../services/historyService";
import { useNavigate } from "react-router-dom";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    historyService.getHistory().then(setHistory);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-screen-lg mx-auto py-10 px-4 space-y-10">

        <h1 className="text-2xl font-semibold">주문 내역</h1>

        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            아직 구매한 상품이 없습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/orders/${item.id}`)}  
                className="cursor-pointer flex items-center gap-6 p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition"
              >
                
                <img
                  src={item.productImage || "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"}
                  alt={item.productName}
                  className="w-28 h-28 object-cover rounded-lg border"
                />

                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-medium">{item.productName}</h3>
                  <p className="text-gray-500 text-sm">
                    {item.totalPrice.toLocaleString()}원 / {item.count}개
                  </p>
                  <p className="text-xs text-gray-400">{item.createdAt} 구매</p>
                </div>

                <div className="text-right font-semibold text-lg">
                  {item.totalPrice.toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default HistoryPage;
