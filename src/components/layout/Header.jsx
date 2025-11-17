import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleChangePage = (url) => {
    navigate(url);
  };

  const handleLogIn = () => {
    if (window.location.pathname === "/auth") {
      window.location.reload();
    } else {
      navigate("/auth");
    }
  };

  return (
    <>
      <div className="w-full h-9 bg-black fixed top-0 z-50"></div>
      <header className="fixed top-9 w-full z-40 bg-white h-17 flex items-center justify-between px-40">
        {/* 좌측: 로고 */}
        <div className="flex gap-4">
          <div
            onClick={() => handleChangePage("/")}
            className="font-bold text-lg cursor-pointer"
          >
            ModeOn
          </div>

          {/* 중앙: 메뉴 */}
          <nav className="flex gap-15 ml-70">
            <div
              onClick={() => handleChangePage("/product?gender=null")}
              className="cursor-pointer"
            >
              ALL
            </div>
            <div
              onClick={() => handleChangePage("/product?gender=MAN")}
              className="cursor-pointer"
            >
              MAN
            </div>
            <div
              onClick={() => handleChangePage("/product?gender=WOMAN")}
              className="cursor-pointer"
            >
              WOMAN
            </div>
            <div
              onClick={() => handleChangePage("/product?gender=KIDS")}
              className="cursor-pointer"
            >
              KIDS
            </div>
          </nav>
        </div>

        {/* 우측: 아이콘 / 로그인 */}
        <div className="flex gap-4">
          <div>SEARCH BARRRRRRR</div>
          {user ? (
            <>
              {/* 🚨 [추가된 My Page 버튼] */}
              <div
                onClick={() => navigate("/mypage")}
                className="cursor-pointer"
              >
                My Page
              </div>

              {user.role === "ROLE_ADMIN" && (
                <div
                  onClick={() => navigate("/admin")}
                  className="cursor-pointer"
                >
                  Admin Page
                </div>
              )}
              <div>LIKE</div>
              <div>CART</div>
              <div onClick={handleLogout} className="cursor-pointer">
                LOGOUT
              </div>
            </>
          ) : (
            <div onClick={handleLogIn} className="cursor-pointer">
              Login
            </div>
          )}
        </div>

        {/* 헤더 밑 구분선 */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300"></div>
      </header>
    </>
  );
};

export default Header;
