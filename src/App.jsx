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
import HistoryPage from "./pages/HistoryPage";
import HistoryDetail from "./pages/HistoryDetail";

import ReviewWrite from "./pages/ReviewWrite";
import ReviewDetail from "./pages/ReviewDetail";
import ReviewEdit from "./pages/ReviewEdit";

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

      </Routes>
    </BrowserRouter>
  );
}
