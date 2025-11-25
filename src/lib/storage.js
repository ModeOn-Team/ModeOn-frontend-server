const ACCESS_TOKEN_KEY = "access_token";

const StorageService = {
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
};

export default StorageService;
