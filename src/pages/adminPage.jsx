import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Category from "../components/admin/Category";
import Product from "../components/admin/Product";
import Stock from "../components/admin/Stock";
import AdminChatListPage from "./AdminChatListPage";

const AdminPage = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "category";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-100 border-r p-6">
          <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab("category")}
              className={`text-left p-2 rounded ${
                activeTab === "category"
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              카테고리 관리
            </button>
            <button
              onClick={() => setActiveTab("product")}
              className={`text-left p-2 rounded ${
                activeTab === "product"
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              상품 관리
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={`text-left p-2 rounded ${
                activeTab === "stock"
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              재고 관리
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`text-left p-2 rounded ${
                activeTab === "chat"
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              채팅
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-10">
          {activeTab === "category" && <Category />}
          {activeTab === "product" && <Product />}
          {activeTab === "stock" && <Stock />}
          {activeTab === "chat" && <AdminChatListPage />}
        </main>
      </div>
    </MainLayout>
  );
};

export default AdminPage;