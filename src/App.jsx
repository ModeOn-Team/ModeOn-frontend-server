import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import OAuth2Callback from "./pages/OAuth2Callback.jsx";
import Home from "./pages/home.jsx";
import AuthPage from "./pages/authPage.jsx";
import ChatListPage from "./pages/ChatListPage.jsx";
import ChatRoomPage from "./pages/ChatRoomPage.jsx";
import AdminChatListPage from "./pages/AdminChatListPage.jsx";
import useAuthStore from "./store/authStore.js";
import AdminPage from "./pages/adminPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage";
import Success from "./pages/Success";
import Fail from "./pages/Fail";
import Mypage from "./pages/myPage"

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />}
        />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/chat"
          element={
            isAuthenticated ? <ChatListPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            isAuthenticated ? <ChatRoomPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/chat/admin"
          element={
            isAuthenticated ? (
              <AdminChatListPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path={import.meta.env.VITE_ADMIN_PAGE_URL}
          element={
            isAuthenticated ? <AdminPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/product"
          element={
            isAuthenticated ? <ProductPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/mypage"
          element={
            isAuthenticated ? <Mypage /> : <Navigate to="/" replace />
          }
        />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* 결제 관련 */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
      </Routes>
    </BrowserRouter>
  );
}
