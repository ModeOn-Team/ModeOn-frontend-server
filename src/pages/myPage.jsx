import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
// 각 탭에 들어갈 컴포넌트 (아직 구현 전)
// import Cart from "../components/mypage/Cart";
import Wishlist from "../components/mypage/Wishlist";
// import Points from "../components/mypage/Points";
// import Membership from "../components/mypage/Membership";
// import Coupons from "../components/mypage/Coupons";
// import Orders from "../components/mypage/Orders";
// import Reviews from "../components/mypage/Reviews";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("cart");

  const tabs = [
    { id: "cart", label: "장바구니" },
    { id: "wishlist", label: "찜 목록" },
    { id: "points", label: "누적 포인트" },
    { id: "membership", label: "멤버십 등급" },
    { id: "coupons", label: "쿠폰" },
    { id: "orders", label: "주문내역" },
    { id: "reviews", label: "내가 작성한 후기" },
  ];

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
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-10">
          {/* {activeTab === "cart" && <Cart />} */}
          {activeTab === "wishlist" && <Wishlist />}
          {/* {activeTab === "points" && <Points />}
          {activeTab === "membership" && <Membership />}
          {activeTab === "coupons" && <Coupons />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "reviews" && <Reviews />} */}
        </main>
      </div>
    </MainLayout>
  );
};

export default MyPage;
