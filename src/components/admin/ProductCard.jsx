import ProductVariantModal from "./ProductVariantModal";
import { useState } from "react";

const ProductCard = ({ product, ProductDelete, onRefresh }) => {
  const { name, price, detailImages } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const mainImage =
    detailImages && detailImages.length > 0
      ? API_URL + "/" + detailImages[0]
      : API_URL + "/images/no-image.png";
  const categories =
    product.category?.largeCategory +
    " > " +
    product.category?.middleCategory +
    " > " +
    product.category?.name;

  const handleProductDelete = async (productId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await ProductDelete(productId);

      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error(error);
      alert("재고 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full">
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={mainImage}
            alt={name}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="text-sm text-gray-500 font-medium">
            {categories || "Uncategorized"}
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h3>
            <p className="text-gray-700 text-base">
              {price?.toLocaleString()}원
            </p>
          </div>

          <div className="flex justify-between mt-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-black hover:bg-red-400 text-white text-sm font-medium py-2 rounded-xl transition-colors duration-200 mr-2"
            >
              add size color
            </button>
            <button
              onClick={() => handleProductDelete(product.id)}
              className="flex-1 bg-black hover:bg-red-400 text-white text-sm font-medium py-2 rounded-xl transition-colors duration-200"
            >
              상품 삭제
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ProductVariantModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
