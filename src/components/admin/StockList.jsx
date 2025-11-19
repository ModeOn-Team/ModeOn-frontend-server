import StockTable from "./StockTable";

const StockList = ({ products, ProductVariantUpdate, onRefresh, lastElementRef, onLocalUpdateStock }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No stock yet. Be the first to add products</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 border-b">카테고리</th>
            <th className="px-4 py-3 border-b">상품명</th>
            <th className="px-4 py-3 border-b">성별</th>
            <th className="px-4 py-3 border-b">가격</th>
            <th className="px-4 py-3 border-b">색</th>
            <th className="px-4 py-3 border-b">사이즈</th>
            <th className="px-4 py-3 border-b">수량</th>
            <th className="px-4 py-3 border-b text-center">액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => {
            const isLast = idx === products.length - 1;
            return (
              <StockTable
                key={product.id}
                product={product}
                ProductVariantUpdate={ProductVariantUpdate}
                onRefresh={onRefresh}
                onLocalUpdateStock={onLocalUpdateStock}
                ref={isLast ? lastElementRef : null}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
