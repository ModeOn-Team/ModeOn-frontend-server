import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import CartPage from "./CartPage";
import Wishlist from "../components/mypage/Wishlist";
import HistoryPage from "./HistoryPage";
import ChatListPage from "./ChatListPage";
import ReturnPage from "./ReturnPage";

// import Reviews from "../components/mypage/Reviews";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);
  

  const tabs = [
    { id: "cart", label: "장바구니" },
    { id: "wishlist", label: "찜 목록" },
    { id: "orders", label: "주문내역" },
    { id: "returns", label: "취소/반품 내역" }, 
    { id: "chat", label: "1:1 문의" },
    // { id: "membership", label: "멤버십 등급" },
    // { id: "points", label: "누적 포인트" },
    // { id: "coupons", label: "쿠폰" },
    // { id: "reviews", label: "내가 작성한 후기" },
  ];

  const handleMembership = () => {
    navigate("/mypage/membership/1");
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen mt-10">
        
        {/* 사이드 메뉴 */}
        <aside className="w-1/4 bg-gray-50 pl-30 p-6">
          <h1 className="text-2xl font-bold mb-8">마이페이지</h1>
          <nav className="flex flex-col gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-2 rounded-md transition ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "hover:bg-gray-200 text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              key={tabs.length + 1}
              onClick={handleMembership}
              className="text-left p-2 rounded-md hover:bg-gray-200 text-gray-800"
            >
              멤버십 등급
            </button>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-10">
          {activeTab === "cart" && <CartPage />}
          {activeTab === "wishlist" && <Wishlist />}
          {activeTab === "orders" && <HistoryPage />}
          {activeTab === "ordersDetail" && <HistoryDetailPage />}
          {activeTab === "returns" && <ReturnPage />}

          {activeTab === "chat" && <ChatListPage />}
          {/* {activeTab === "reviews" && <Reviews />} */}
        </main>
      </div>
    </MainLayout>
  );
};

export default MyPage;
