import React, { useEffect, useState } from "react";
import { cartService } from "../services/cartService";


function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const loadCart = async () => {
    try {
      const data = await cartService.getCartItems();
      setCartItems(data);
    } catch (err) {
      console.error("장바구니 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadCart();

    // 결제 완료 후 장바구니 갱신을 위한 이벤트 리스너
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // 전체 선택
  const handleSelectAll = () => {
    if (selectAll) setSelectedItems([]);
    else setSelectedItems(cartItems.map((item) => item.id));
    setSelectAll(!selectAll);
  };

  // 개별 선택
  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 수량 변경
  const handleCountChange = async (item, delta) => {
    const newCount = Math.max(item.count + delta, 1);
    await cartService.updateCount(item.id, newCount);
    loadCart();
  };

  // 선택 삭제
  const handleRemoveSelected = async () => {
    for (const cartItemId of selectedItems) {
      await cartService.removeItem(cartItemId);
    }
    setSelectedItems([]);
    setSelectAll(false);
    loadCart();
  };

 
  const handlePayment = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
  
    if (selectedProducts.length === 0)
      return alert("결제할 상품을 선택하세요.");
  

    const normalizedItems = selectedProducts.map((item) => ({
      id: item.id,
      size: item.size,
      color: item.color,
      count: item.count,               
      productPrice: item.productPrice,  
      productName: item.productName     
    }));
  
    const query = new URLSearchParams({
      items: JSON.stringify(normalizedItems),
      from: "cart",
    }).toString();
  
    window.location.href = `/order?${query}`;
  };
  

  
  // 총액 계산
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.productPrice * item.count, 0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  return (
    <div className="max-w-screen-xl mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">장바구니</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100"
          >
            {selectAll ? "전체 해제" : "전체 선택"}
          </button>
          <button
            onClick={handleRemoveSelected}
            disabled={selectedItems.length === 0}
            className="text-sm border px-3 py-1 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            선택 삭제
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-24">
          장바구니가 비어 있습니다 🛒
        </div>
      ) : (
        <>
          <div className="flex flex-col bg-white rounded-2xl shadow-sm divide-y">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="w-4 h-4"
                />

                <img
                  src={
                    API_URL + item.productImage ||
                    "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"
                  }
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-lg border"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.productName}</h3>

               
                  <p className="text-sm text-gray-500">
                    옵션: {item.size} / {item.color}
                  </p>

                  <p className="text-gray-500 mt-1">
                    {item.productPrice.toLocaleString()}원
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleCountChange(item, -1)}
                      className="w-8 h-8 border rounded-md"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.count}</span>
                    <button
                      onClick={() => handleCountChange(item, +1)}
                      className="w-8 h-8 border rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">합계</div>
                  <div className="text-lg font-semibold">
                    {(item.productPrice * item.count).toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-gray-600">
              선택된 상품{" "}
              <span className="font-medium">{selectedItems.length}</span>개
            </div>

            <div className="flex items-center gap-6">
              <div className="text-xl font-semibold">
                {totalPrice.toLocaleString()}원
              </div>
              <button
                onClick={handlePayment}
                disabled={selectedItems.length === 0}
                className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                결제하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;