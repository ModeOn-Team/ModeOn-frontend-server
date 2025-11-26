import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Category from "../components/admin/Category";
import AdminCategory from "../components/admin/AdminCategory.jsx";
import Product from "../components/admin/Product";
import AdminChatListPage from "./AdminChatListPage";
import Stock from "../components/admin/Stock";
import Delivery from "../components/admin/Delivery";
import AdminRequestList from "../components/admin/AdminRequestList.jsx";
import AdminNewProductPage from "./AdminNewProductPage.jsx";

const AdminPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab") || "category";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const moveTab = (tab) => {
    setActiveTab(tab);
    navigate(`/modeon-admin1101?tab=${tab}`);
  };

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-100 border-r p-6">
          <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => moveTab("category")}
              className={`text-left p-2 rounded ${
                activeTab === "category" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              카테고리 관리
            </button>

            <button
              onClick={() => moveTab("product")}
              className={`text-left p-2 rounded ${
                activeTab.includes("product")
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              상품 관리
            </button>

            <button
              onClick={() => moveTab("stock")}
              className={`text-left p-2 rounded ${
                activeTab === "stock" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              재고 관리
            </button>

            <button
              onClick={() => moveTab("chat")}
              className={`text-left p-2 rounded ${
                activeTab === "chat" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              채팅
            </button>

            <button
              onClick={() => moveTab("delivery")}
              className={`text-left p-2 rounded ${
                activeTab === "delivery" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              배송 관리
            </button>

            <button
              onClick={() => moveTab("requests")}
              className={`text-left p-2 rounded ${
                activeTab === "requests" ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
            >
              교환/환불 요청 관리
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-10">
          {activeTab === "category" && <AdminCategory />}
          {activeTab === "product" && <Product setActiveTab={setActiveTab}/>}
          {activeTab === "product new" && <AdminNewProductPage />}
          {activeTab === "stock" && <Stock />}
          {activeTab === "chat" && <AdminChatListPage />}
          {activeTab === "delivery" && <Delivery />}
          {activeTab === "requests" && <AdminRequestList />}
        </main>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
