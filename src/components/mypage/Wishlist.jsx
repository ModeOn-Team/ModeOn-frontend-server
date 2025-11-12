import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWishListStore from "../../store/wishListStore";
import { wishListService } from "../../services/wishList";

const Wishlist = () => {
  const { myWishList, fetchMyWishList } = useWishListStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyWishList();
  }, [fetchMyWishList]);

  const toggleWishList = async (e, productId) => {
    e.stopPropagation();
    const confirmed = window.confirm("삭제하시겠습니까?");
    if (!confirmed) return; 

    try {
      await wishListService.toggleWishList(productId);
      fetchMyWishList(); 
    } catch (error) {
      console.error("찜 토글 실패:", error);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const mainImage = (detailImage) =>
    detailImage
      ? API_URL + detailImage
      : API_URL + "/images/no-image.png";

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-6">찜 목록</h2>

      {myWishList.length === 0 ? (
        <p className="text-gray-500 text-center">찜한 상품이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {myWishList.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="flex items-center justify-between border-b pb-4 cursor-pointer"
            >
              {/* 상품 이미지 + 정보 */}
              <div className="flex items-center gap-4">
                <img
                  src={mainImage(item.detailImages?.[0])}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {item.brand}
                  </p>
                  <p className="text-sm text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">즉시 구매가</p>
                  <p className="text-lg font-semibold">
                    {item.price.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 가격 + 북마크 */}
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <span onClick={(e) => toggleWishList(e, item.id)}>삭제</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
