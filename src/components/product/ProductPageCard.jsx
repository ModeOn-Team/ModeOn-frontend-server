import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { wishListService } from "../../services/wishList";

const ProductPageCard = ({ product }) => {
  const navigate = useNavigate();

  console.log("product",product);
  const [isWish, setIsWish] = useState(product.wishList);
  const [wishCount, setWishCount] = useState(product.wishListCount || 0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const mainImage =
    product.detailImages && product.detailImages.length > 0
      ? API_URL + "/" + product.detailImages[0]
      : API_URL + "/images/no-image.png";

  const toggleWishList = async (e, productId) => {
    e.stopPropagation();
    try {
      await wishListService.toggleWishList(productId);
      setIsWish((prev) => !prev);
      setWishCount((prev) => (isWish ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("찜 토글 실패:", error);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="hover:shadow-lg transition-all duration-300 overflow-hidden w-full"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <h4 className="text-lg font-semibold text-gray-900 truncate">
              {product.price?.toLocaleString()} 원
            </h4>

            <div className="flex items-center">
              <span
                onClick={(e) => toggleWishList(e, product.id)}
                className={`material-icons text-2xl ${
                  isWish ? "text-red-500" : "text-gray-400"
                }`}
              >
                {isWish ? "favorite" : "favorite_border"}
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-base">{product.name}</p>
        </div>

        <div className="text-sm text-gray-500 font-medium">
          {product.gender} - {product.category?.name || "Uncategorized"}
          <div className="text-sm text-gray-500 font-light">
            <p>찜: {wishCount} 후기: {product.commentCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageCard;
