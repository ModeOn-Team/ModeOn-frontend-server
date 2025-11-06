import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import OAuth2Callback from "./pages/OAuth2Callback.jsx";
import Home from "./pages/home.jsx";
import AuthPage from "./pages/authPage.jsx";
import ChatListPage from "./pages/ChatListPage.jsx";
import ChatRoomPage from "./pages/ChatRoomPage.jsx";
import AdminChatListPage from "./pages/AdminChatListPage.jsx";
import useAuthStore from "./store/authStore.js";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/auth" replace />
          }
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
            isAuthenticated ? <AdminChatListPage /> : <Navigate to="/auth" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
