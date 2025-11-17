import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import OAuth2Callback from "./pages/OAuth2Callback.jsx";
import Home from "./pages/home.jsx";
import AuthPage from "./pages/authPage.jsx";
import useAuthStore from "./store/authStore.js";
import AdminPage from "./pages/adminPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Success from "./pages/Success.jsx";
import Fail from "./pages/Fail.jsx";
import MyPage from "./pages/MyPage.jsx"; // MyPage
import MembershipDetailPage from "./pages/MembershipDetailPage.jsx"; // 멤버십
import MembershipLevelPage from "./pages/MembershipLevelPage.jsx"; // 멤버십 등급
import CouponPage from "./pages/CouponPage.jsx"; // 쿠폰 페이지
import PointPage from "./pages/PointPage.jsx"; // 포인트 페이지
import ReviewPage from "./pages/ReviewPage.jsx"; // 리뷰 페이지

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
          path={adminPageUrl}
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
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route
          path="/mypage"
          element={
            isAuthenticated ? <MyPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/mypage/membership"
          element={
            isAuthenticated ? (
              <MembershipDetailPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/mypage/membership/levels"
          element={
            isAuthenticated ? (
              <MembershipLevelPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        {/* 포인트 페이지 */}
        <Route path="/mypage/point" element={<PointPage />} />
        {/* 쿠폰 페이지 */}
        <Route path="/mypage/coupon" element={<CouponPage />} />
        {/* 결제 관련 */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
        {/* 리뷰 관련 */}
        <Route path="/mypage/point" element={<PointPage />} />
        <Route path="/mypage/reviews" element={<ReviewPage />} /> {/* 추가 */}
      </Routes>
    </BrowserRouter>
  );
}
