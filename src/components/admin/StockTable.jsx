import { forwardRef, useState } from "react";

const StockTable = forwardRef(
  ({ product, ProductVariantUpdate, onRefresh, onLocalUpdateStock }, ref) => {
    const [stockChange, setStockChange] = useState({});
    const [open, setOpen] = useState(false);

    const toggleOpen = () => setOpen((prev) => !prev);

    const handleStockUpdate = async (variant, isIncrease) => {
      const value = Number(stockChange[variant.id]);
      if (isNaN(value) || value <= 0) {
        alert("변경할 재고 수량을 입력하세요.");
        return;
      }

      try {
        const stockDiff = isIncrease ? value : -value;
        await ProductVariantUpdate(variant.id, {
          size: variant.size,
          color: variant.color,
          stock: stockDiff,
        });

        if (onLocalUpdateStock) {
          onLocalUpdateStock(variant.id, stockDiff);
        }

        setStockChange((prev) => ({ ...prev, [variant.id]: "" }));

        if (onRefresh) await onRefresh();
      } catch (error) {
        console.error(error);
        alert("재고 변경 중 오류가 발생했습니다.");
      }
    };

    const categories =
      product.category?.largeCategory +
      " > " +
      product.category?.middleCategory +
      " > " +
      product.category?.name;

    return (
      <>
        {/* 첫 번째 행: 제품 기본 정보 */}
        <tr
          ref={ref}
          className="cursor-pointer hover:bg-gray-50"
          onClick={toggleOpen}
        >
          <td className="px-4 py-3 border-b border-t text-gray-600">
            {categories || "Uncategorized"}
          </td>
          <td className="px-4 py-3 border-b border-t font-medium text-gray-900">
            {product.name}
          </td>
          <td className="px-4 py-3 border-b border-t font-medium text-gray-900">
            {product.gender}
          </td>
          <td className="px-4 py-3  border-b border-t text-gray-700">
            {product.price?.toLocaleString()}원
          </td>
          <td className="px-4 py-2 border-b  border-t">-</td>
          <td className="px-4 py-2 border-b border-t">-</td>
          <td className="px-4 py-2 border-b border-t">-</td>
          <td className="px-4 py-2 border-b border-t"></td>
        </tr>

        {/* open일 때 variant 상세 행 */}
        {open &&
          product.variants.map((variant) => (
            <tr key={variant.id} className="bg-gray-50">
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">-</td>
              <td className="px-4 py-2">{variant.color}</td>
              <td className="px-4 py-2">{variant.size}</td>
              <td className="px-4 py-2">{variant.stock}</td>
              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <input
                    type="number"
                    value={stockChange[variant.id] || ""}
                    onChange={(e) =>
                      setStockChange((prev) => ({
                        ...prev,
                        [variant.id]: e.target.value,
                      }))
                    }
                    placeholder="수량"
                    className="w-16 text-center border border-gray-300 rounded-lg py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <button
                    onClick={() => handleStockUpdate(variant, true)}
                    className="bg-black hover:bg-red-400 text-white px-2 py-1 rounded-lg text-xs font-medium"
                  >
                    추가
                  </button>
                  <button
                    onClick={() => handleStockUpdate(variant, false)}
                    className="bg-black hover:bg-red-400 text-white px-2 py-1 rounded-lg text-xs font-medium"
                  >
                    차감
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </>
    );
  }
);

export default StockTable;
