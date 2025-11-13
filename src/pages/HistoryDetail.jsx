import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { historyService } from "../services/historyService";
import MainLayout from "../components/layout/MainLayout";

function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await historyService.getHistoryDetail(id);
      setInfo(data);
    };
    load();
  }, [id]);

  if (!info) return null;

  return (
    <MainLayout>
      <div className="max-w-screen-md mx-auto py-16 space-y-10">

        
        <h2 className="text-2xl font-bold">주문 상세 내역</h2>

        
        <div className="bg-white p-8 rounded-2xl shadow-sm border flex gap-8">
          <img
            src={info.productImage || "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"}
            alt={info.productName}
            className="w-48 h-48 rounded-xl object-cover border"
          />

          <div className="flex flex-col justify-between py-2">
            <div>
              <h3 className="text-xl font-semibold">{info.productName}</h3>
              <p className="text-gray-500 text-sm mt-1">{info.createdAt} 구매</p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">수량 : {info.count}개</p>
              <p className="text-2xl font-bold">{info.totalPrice.toLocaleString()}원</p>
            </div>
          </div>
        </div>


        <div className="flex gap-4">
          <button
            onClick={() => navigate("/history")}
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
