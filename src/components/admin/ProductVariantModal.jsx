import { useState } from "react";
import useAdminStore from "../../store/adminStore";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "FREE"];
const COLORS = [
  { name: "WHITE", hex: "#FFFFFF" },
  { name: "BLACK", hex: "#000000" },
  { name: "GRAY", hex: "#808080" },
  { name: "BEIGE", hex: "#F5F5DC" },
  { name: "BROWN", hex: "#8B4513" },
  { name: "NAVY", hex: "#000080" },
  { name: "BLUE", hex: "#0000FF" },
  { name: "SKY_BLUE", hex: "#87CEEB" },
  { name: "GREEN", hex: "#008000" },
  { name: "KHAKI", hex: "#78866B" },
  { name: "YELLOW", hex: "#FFFF00" },
  { name: "ORANGE", hex: "#FFA500" },
  { name: "RED", hex: "#FF0000" },
  { name: "PINK", hex: "#FFC0CB" },
  { name: "PURPLE", hex: "#800080" },
  { name: "IVORY", hex: "#FFFFF0" },
  { name: "GOLD", hex: "#FFD700" },
  { name: "SILVER", hex: "#C0C0C0" },
];

const ProductVariantModal = ({ product, onClose }) => {
  const { ProductVariantCreate } = useAdminStore();
  const [size, setSize] = useState(SIZES[0]);
  const [color, setColor] = useState(COLORS[0].name);
  const [stock, setStock] = useState(1);

  const handleSubmit = async () => {
    try {
      const res = await ProductVariantCreate(product.id, {
        size,
        color,
        stock,
      });

      if (res?.error) {
        alert("에러가 발생했습니다: " + res.error);
      } else {
        alert("재고가 성공적으로 추가되었습니다!");
        onClose();
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-start z-50 bg-black/30 overflow-y-auto mt-20"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-gray-300 rounded-lg p-6 w-3/4 max-w-4xl mt-12 mb-12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          재고 추가: {product.name}
        </h2>

        <div className="flex flex-col gap-3 mb-4">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {COLORS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="수량"
            value={stock}
            min={1}
            onChange={(e) => setStock(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSubmit}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductVariantModal;