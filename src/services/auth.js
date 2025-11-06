import api from "./api";

export const authService = {
  async login(userData) {
    const response = await api.post("/api/auth/login", userData);
    const { access_token, refresh_token, user } = response.data;

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  },

  async register(userData) {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  async sendEmail(email) {
    const response = await api.post(`/api/auth/sendEmail`, { email });
    return response.data;
  },

  async verifyEmail(code, email) {
    const response = await api.post(`/api/auth/verifyEmail/${code}`, { email });
    return response.data;
  },

  async PasswordResetCode(code, email) {
    const response = await api.post(`/api/auth/findPw/${code}`, { email });
    return response.data;
  },

  async resetPassword(formData) {
    const response = await api.post(`api/auth/changePw`,  formData );
    return response.data;
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};