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
                className="flex items-center gap-6 p-5 bg-white rounded-xl shadow-sm border"
              >
                
                {/* 상품 이미지 */}
                <img
                  src={item.productImage || "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"}
                  alt={item.productName}
                  className="w-28 h-28 object-cover rounded-lg border"
                />

                {/* 상품 정보 */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-medium">{item.productName}</h3>
                  <p className="text-gray-500 text-sm">
                    {item.totalPrice.toLocaleString()}원 / {item.count}개
                  </p>
                  <p className="text-xs text-gray-400">{item.createdAt} 구매</p>

                  {/* { 리뷰 버튼 } */}
                  {item.hasReview ? (
                    <button
                    onClick={() => navigate(`/review/${item.reviewId}`)}

                      className="text-blue-600 text-sm underline font-medium"
                    >
                      리뷰 보기
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/review/write/${item.id}`)}
                      className="text-black text-sm underline font-medium"
                    >
                      리뷰 쓰기
                    </button>
                  )}
                </div>

                {/*주문 상세 보기 버튼 */}
                <div className="text-right">
                  <div className="font-semibold text-lg mb-3">
                    {item.totalPrice.toLocaleString()}원
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${item.id}`)}
                    className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100"
                  >
                    상세보기
                  </button>
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
