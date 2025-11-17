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
import CartPage from "./pages/CartPage.jsx";
import Success from "./pages/Success.jsx";
import Fail from "./pages/Fail.jsx";
import MembershipDetailPage from "./pages/MembershipDetailPage.jsx";
import MembershipLevelPage from "./pages/MembershipLevelPage.jsx";
import CouponPage from "./pages/CouponPage.jsx";
import PointPage from "./pages/PointPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import HistoryPage from "./pages/HistoryPage";
import HistoryDetail from "./pages/HistoryDetail";

import ReviewWrite from "./pages/ReviewWrite";
import ReviewDetail from "./pages/ReviewDetail";
import ReviewEdit from "./pages/ReviewEdit";
import RequestPage from "./pages/RequestPage";

import Mypage from "./pages/myPage";
import SearchProductPage from "./pages/searchProductPage.jsx";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  const adminPageUrl = "/admin"; // 관리자 페이지 URL 하드코딩

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
          path={import.meta.env.VITE_ADMIN_PAGE_URL || "/admin"}
          element={
            isAuthenticated ? <AdminPage /> : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/product"
          element={
            isAuthenticated ? <ProductPage /> : <Navigate to="/auth" replace />
          }
        />
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
        <Route
          path="/mypage"
          element={isAuthenticated ? <Mypage /> : <Navigate to="/" replace />}
        />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />

        <Route
          path="/orders"
          element={isAuthenticated ? <HistoryPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/orders/:id"
          element={isAuthenticated ? <HistoryDetail /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/orders/:id/request"
          element={isAuthenticated ? <RequestPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/review/write/:historyId"
          element={isAuthenticated ? <ReviewWrite /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/review/:reviewId"
          element={isAuthenticated ? <ReviewDetail /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/review/edit/:reviewId"
          element={isAuthenticated ? <ReviewEdit /> : <Navigate to="/auth" replace />}
        />

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
        <Route path="/mypage/point" element={<PointPage />} />
        <Route path="/mypage/coupon" element={<CouponPage />} />
        {/* 결제 관련 */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
        {/* 리뷰 관련 */}
        <Route path="/mypage/point" element={<PointPage />} />
        <Route path="/mypage/reviews" element={<ReviewPage />} />
      </Routes>

    </BrowserRouter>
  );
}
