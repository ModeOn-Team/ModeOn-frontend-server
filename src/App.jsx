import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import CartPage from "./pages/CartPage.jsx";
import Success from "./pages/Success.jsx";
import Fail from "./pages/Fail.jsx";
import MembershipDetailPage from "./pages/MembershipDetailPage.jsx";
import MembershipLevelPage from "./pages/MembershipLevelPage.jsx";
import CouponPage from "./pages/CouponPage.jsx";
import PointPage from "./pages/PointPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import Mypage from "./pages/myPage"; // ← 정확한 이름
import SearchProductPage from "./pages/searchProductPage.jsx";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />}
        />

        {/* 인증 */}
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
        />

        {/* 채팅 */}
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

        {/* 관리자 페이지 */}
        <Route
          path={import.meta.env.VITE_ADMIN_PAGE_URL}
          element={
            isAuthenticated ? <AdminPage /> : <Navigate to="/auth" replace />
          }
        />

        {/* 상품 */}
        <Route
          path="/product"
          element={
            isAuthenticated ? <ProductPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route
          path="/search"
          element={
            isAuthenticated ? (
              <SearchProductPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* 마이페이지 및 하위 페이지 */}
        <Route
          path="/mypage"
          element={
            isAuthenticated ? <Mypage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/mypage/membership"
          element={
            isAuthenticated ? (
              <MembershipLevelPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/mypage/membership/:id"
          element={
            isAuthenticated ? (
              <MembershipDetailPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/mypage/point"
          element={
            isAuthenticated ? <PointPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/mypage/coupon"
          element={
            isAuthenticated ? <CouponPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/mypage/reviews"
          element={
            isAuthenticated ? <ReviewPage /> : <Navigate to="/auth" replace />
          }
        />

        {/* 장바구니 & 결제 */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
      </Routes>
    </BrowserRouter>
  );
}
