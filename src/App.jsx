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
import HistoryPage from "./pages/HistoryPage.jsx";
import HistoryDetail from "./pages/HistoryDetail.jsx";
import ReviewWrite from "./pages/ReviewWrite.jsx";
import ReviewDetail from "./pages/ReviewDetail.jsx";
import ReviewEdit from "./pages/ReviewEdit.jsx";
import RequestPage from "./pages/RequestPage.jsx";
import Mypage from "./pages/myPage.jsx";
import SearchProductPage from "./pages/searchProductPage.jsx";
import OrderSheetPage from "./pages/OrderSheetPage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRequestDetail from "./pages/AdminRequestDetail";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />}
        />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
        />

        {/*  관리자 요청 상세 페이지 */}
        <Route
          path="/admin/request/:id"
          element={
            isAuthenticated ? <AdminRequestDetail /> : <Navigate to="/auth" replace />
          }
        />

        {/* 관리자 메인 */}
        <Route
          path={import.meta.env.VITE_ADMIN_PAGE_URL || "/admin"}
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

        {/* 검색 */}
        <Route
          path="/search"
          element={
            isAuthenticated ? <SearchProductPage /> : <Navigate to="/" replace />
          }
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
            <ProtectedRoute>
              <ChatRoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/admin"
          element={
            isAuthenticated ? <AdminChatListPage /> : <Navigate to="/auth" replace />
          }
        />

        {/* 장바구니 */}
        <Route path="/cart" element={<CartPage />} />

        {/* 주문서 */}
        <Route
          path="/order"
          element={
            isAuthenticated ? <OrderSheetPage /> : <Navigate to="/auth" replace />
          }
        />

        {/* 결제 */}
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />

        {/* 주문 내역 */}
        <Route
          path="/orders"
          element={
            isAuthenticated ? <HistoryPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/orders/:id"
          element={
            isAuthenticated ? <HistoryDetail /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/orders/:id/request"
          element={
            isAuthenticated ? <RequestPage /> : <Navigate to="/auth" replace />
          }
        />

        {/* 리뷰 */}
        <Route
          path="/review/write/:historyId"
          element={
            isAuthenticated ? <ReviewWrite /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/review/:reviewId"
          element={
            isAuthenticated ? <ReviewDetail /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/review/edit/:reviewId"
          element={
            isAuthenticated ? <ReviewEdit /> : <Navigate to="/auth" replace />
          }
        />

        {/* 마이페이지 */}
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
        <Route path="/mypage/reviews" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
