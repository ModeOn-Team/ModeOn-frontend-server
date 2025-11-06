import { useNavigate } from "react-router-dom";

const HomeProductCard = ({ product, pageSize }) => {
  const navigate = useNavigate();

  const { name, price, detailImages } = product;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const mainImage =
    detailImages && detailImages.length > 0
      ? API_URL + "/" + detailImages[0]
      : API_URL + "/images/no-image.png";

  return (
    <>
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="hover:shadow-lg transition-all duration-300 overflow-hidden w-full"
      >
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={name}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-gray-900 truncate">
              {price?.toLocaleString()} 원
            </h4>
            <p className="text-gray-700 text-base">{name}</p>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {product.category?.name || "Uncategorized"}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeProductCard;
