import { useState } from "react";

const StockTable = ({ product, ProductVariantUpdate, onRefresh }) => {
  const [stockChange, setStockChange] = useState({});

  const handleStockUpdate = async (variant, isIncrease) => {
    const value = Number(stockChange[variant.id]);
    if (isNaN(value) || value <= 0) {
      alert("변경할 재고 수량을 입력하세요.");
      return;
    }

    try {
      const stockDiff = isIncrease ? value : -value;
      const res = await ProductVariantUpdate({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        stock: stockDiff,
      });
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
      {(product.variants || []).map((variant, index) => (
        <tr
          key={variant.id || `${product.id}-${index}`}
          className="hover:bg-gray-50 transition-colors border-b"
        >
          {index === 0 && (
            <>
              <td
                rowSpan={product.variants.length}
                className="px-4 py-3 text-gray-600 align-top"
              >
                {categories || "Uncategorized"}
              </td>
              <td
                rowSpan={product.variants.length}
                className="px-4 py-3 font-medium text-gray-900 align-top"
              >
                {product.name}
              </td>
              <td
                rowSpan={product.variants.length}
                className="px-4 py-3 font-medium text-gray-900 align-top"
              >
                {product.gender}
              </td>
              <td
                rowSpan={product.variants.length}
                className="px-4 py-3 text-gray-700 align-top"
              >
                {product.price?.toLocaleString()}원
              </td>
            </>
          )}
          <td className="px-4 py-3 text-gray-900 border-l border-gray-200">
            {variant.color}
          </td>
          <td className="px-4 py-3 text-gray-900">{variant.size}</td>
          <td className="px-4 py-3 text-gray-900">{variant.stock}</td>

          <td className="px-4 py-3 text-center space-x-2">
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
};

export default StockTable;
