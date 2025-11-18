import { useState } from "react";
import { cartService } from "../../services/cartService";
import { useNavigate } from "react-router-dom";
import { wishListService } from "../../services/wishList";

const ProductDetailSide = ({
  id,
  name,
  category,
  gender,
  price,
  variants = [],
  wishList,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isWish, setIsWish] = useState(wishList);
  const navigate = useNavigate();

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedVariant = variants.find((v) => v.id === Number(selectedId));
    const exists = selectedOptions.find(
      (selectedOption) => selectedOption.id === selectedVariant.id
    );

    if (!exists) {
      setSelectedOptions((prev) => [
        ...prev,
        { ...selectedVariant, quantity: 1 },
      ]);
    }

    e.target.value = "";
  };

  const handleQuantityChange = (id, delta) => {
    setSelectedOptions((prev) =>
      prev
        .map((selectedOption) =>
          selectedOption.id === id
            ? {
                ...selectedOption,
                quantity: Math.max(1, selectedOption.quantity + delta),
              }
            : selectedOption
        )
        .filter((selectedOption) => selectedOption.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setSelectedOptions((prev) =>
      prev.filter((selectedOption) => selectedOption.id !== id)
    );
  };

  const handleAddToCart = async (selectedOptions) => {
    if (selectedOptions.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }
    try {
      for (const option of selectedOptions) {
        await cartService.addItem({
          productId: id,
          count: option.quantity,
          size: option.size,
          color: option.color,
        });
        
      }
      alert("장바구니에 담겼습니다!");
      navigate("/mypage?tab=cart"); 
    } catch (err) {
      console.error(err);
      alert("장바구니 담기 실패!");
    }
  };

  const toggleWishList = async (e) => {
    e.stopPropagation();
    try {
      await wishListService.toggleWishList(id);
      setIsWish((prev) => !prev);
    } catch (error) {
      console.error("찜 토글 실패:", error);
    }
  };

  return (
    <>
      <p className="text-gray-500 text-sm mb-2">
        {gender} &gt; {category?.largeCategory} &gt; {category?.middleCategory}{" "}
        &gt; {category?.smallCategory}
      </p>

      <h2 className="text-3xl font-bold">{name}</h2>
      <p className="text-xl text-gray-700">{price?.toLocaleString()}원</p>

      <div className="border-b pb-4">
        <h4 className="font-semibold mb-2">옵션 선택</h4>
        <select
          onChange={handleSelect}
          defaultValue=""
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="" disabled>
            옵션을 선택하세요
          </option>

          {variants.map((variant) => (
            <option
              key={variant.id}
              value={variant.id}
              disabled={variant.stock === 0}
              className={variant.stock === 0 ? "text-gray-400" : ""}
            >
              {variant.size} / {variant.color}
              {variant.stock === 0 ? " (품절)" : ""}
            </option>
          ))}
        </select>
      </div>

      {selectedOptions.length > 0 && (
        <div className="mt-3 flex flex-col gap-3">
          {selectedOptions.map((selectedOption) => (
            <div
              key={selectedOption.id}
              className="flex items-center justify-between border rounded-lg p-3 bg-gray-50"
            >
              <p className="font-medium text-gray-800">
                {selectedOption.size} / {selectedOption.color}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(selectedOption.id, -1)}
                  className="px-2 py-1 hover:font-bold hover:text-red-500"
                >
                  -
                </button>
                <span className="min-w-[24px] text-center">
                  {selectedOption.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(selectedOption.id, 1)}
                  className="px-2 py-1 hover:font-bold hover:text-red-500"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemove(selectedOption.id)}
                className="text-gray-400 hover:text-red-500 transition text-sm font-bold ml-2"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-row gap-4 mt-3">
        <div className="flex items-center">
          <span
            onClick={(e) => toggleWishList(e)}
            className={`material-icons text-2xl ${
              isWish ? "text-red-500" : "text-gray-400"
            }`}
          >
            {isWish ? "favorite" : "favorite_border"}
          </span>
        </div>
        <button className="bg-black text-white w-full py-3 rounded-xl hover:bg-red-400 transition" onClick={()=> handleAddToCart(selectedOptions)}>
          장바구니
        </button>
        <button className="bg-black text-white w-full py-3 rounded-xl hover:bg-red-400 transition">
          구매하기
        </button>
      </div>

      <div className="text-sm mt-3">
        <p className="font-medium">🚚 ModeOn 회원은 전 품목 무료 배송</p>
        <p className="text-gray-500 text-xs">
          (일부 상품 및 도서 산간 지역 제외)
        </p>
      </div>

      <p className="font-semibold mb-2 mt-4">이 상품을 활용한 사진 후기</p>
      <div className="text-gray-400 text-sm">아직 등록된 후기가 없습니다.</div>
    </>
  );
};

export default ProductDetailSide;
