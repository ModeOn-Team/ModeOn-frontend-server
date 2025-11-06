import React, { useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import "./CartPage.css";
import { loadTossPayments } from "@tosspayments/payment-sdk";


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
  }, []);

//전체선택
  const handleSelectAll = () => {
    if (selectAll) setSelectedItems([]); //만약 전체선택이면(true) 빈배열로 바꾼다 (모든 선택해제로 바꿈)
    else setSelectedItems(cartItems.map((item) => item.id)); //반대경우 전체선택으로 
    setSelectAll(!selectAll);
  };

  //개별선택
  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  //수량변경
    const handleCountChange = async (item, delta) => {
    const newCount = Math.max(item.count + delta, 1); //1보다는 항상 크게
    await cartService.updateCount(item.product.id, newCount);
    loadCart();
  };

  const handleRemoveSelected = async () => {
    for (const itemId of selectedItems) {
      const item = cartItems.find((i) => i.id === itemId);
      await cartService.removeItem(item.product.id);
    }
    setSelectedItems([]);
    setSelectAll(false);
    loadCart();
  };

  //결제
const handlePayment = async () => {
  const selectedProducts = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  if (selectedProducts.length === 0) {
    alert("결제할 상품을 선택하세요.");
    return;
  }

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.count,
    0
  );

  
  const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);



  const orderId = "order_" + Date.now();

  await tossPayments.requestPayment("카드", {
    amount: totalAmount,
    orderId: orderId,
    orderName: selectedProducts.map((p) => p.product?.name).join(", "),
    successUrl: `${window.location.origin}/success`, 
    failUrl: `${window.location.origin}/fail`, 
  });
};


  //총액
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.product?.price || 0) * item.count, 0);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>장바구니</h1>
      </div>

      <div className="cart-controls">
        <button onClick={handleSelectAll}>
          {selectAll ? "전체 해제" : "전체 선택"}
        </button>
        <button
          onClick={handleRemoveSelected}
          disabled={selectedItems.length === 0}
          className="delete-btn"
        >
          선택 삭제
        </button>
      </div>
      {cartItems.length === 0 ? (
        <div className="empty-state">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="empty"
          />
          <p>장바구니가 비어 있습니다</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`cart-item ${
                  selectedItems.includes(item.id) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
                <img
                  src={
                    item.product?.imageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/7596/7596292.png"
                  }
                  alt={item.product?.name}
                />
                <div className="info">
                  <h3>{item.product?.name}</h3>
                  <p className="price">
                    {(item.product?.price || 0).toLocaleString()}원
                  </p>
                  <div className="quantity">
                    <button onClick={() => handleCountChange(item, -1)}>-</button>
                    <span>{item.count}</span>
                    <button onClick={() => handleCountChange(item, +1)}>+</button>
                  </div>
                </div>
                <div className="item-total">
                  {(item.product?.price * item.count || 0).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="summary">
              <span>선택된 상품 {selectedItems.length}개</span>
              <strong>{totalPrice.toLocaleString()}원</strong>
            </div>
            <button
              onClick={handlePayment}
              disabled={selectedItems.length === 0}
              className="checkout-btn"
            >
              결제하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
