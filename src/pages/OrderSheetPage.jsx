import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductService } from "../services/product";
import { paymentService } from "../services/paymentService";
import MainLayout from "../components/layout/MainLayout";

const OrderSheetPage = () => {
  const [params] = useSearchParams();
  const items = params.get("items");
  const selectedItems = items ? JSON.parse(items) : [];
  const productId = params.get("productId");
  const isFromCart = params.get("from") === "cart";

  const [product, setProduct] = useState(null);

  // 주문자 정보
  const [orderer, setOrderer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // 배송지 정보
  const [shipping, setShipping] = useState({
    receiver: "",
    phone: "",
    address: "",
    memo: "",
  });

  const [sameAsOrderer, setSameAsOrderer] = useState(false);

  // 상품 불러오기 (단일 상품)
  useEffect(() => {
    if (!isFromCart && productId) {
      const load = async () => {
        const p = await ProductService.getProductById(productId);
        setProduct(p);
      };
      load();
    }
  }, [isFromCart, productId]);

  // 주문자 정보 동일
  useEffect(() => {
    if (sameAsOrderer) {
      setShipping((prev) => ({
        ...prev,
        receiver: orderer.name,
        phone: orderer.phone,
      }));
    }
  }, [sameAsOrderer, orderer]);

  // 상품 금액
  const totalAmount = isFromCart
    ? selectedItems.reduce(
        (sum, item) => sum + item.productPrice * item.count,
        0
      )
    : selectedItems.reduce(
        (sum, opt) => sum + opt.quantity * (product?.price || 0),
        0
      );

  const deliveryFee = 0; // 무료 배송
  const finalAmount = totalAmount + deliveryFee;

  const handlePayment = async () => {
    if (!orderer.name || !orderer.phone || !orderer.email) {
      alert("주문자 정보를 모두 입력해주세요.");
      return;
    }

    if (!shipping.receiver || !shipping.phone) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    if (!shipping.address) {
      alert("주소를 입력해주세요.");
      return;
    }

    const orderId = "order-" + Date.now();
    const orderName = isFromCart
      ? selectedItems.length > 1
        ? `${selectedItems[0].productName} 외 ${selectedItems.length - 1}개`
        : selectedItems[0].productName
      : product?.name;

    await paymentService.requestPayment({
      orderId,
      amount: finalAmount,
      productName: orderName,
    });
  };

  if (!isFromCart && !product) return <MainLayout>불러오는 중...</MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">주문서</h2>

        {/* 주문자 정보 */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">주문자 정보</h3>
          <div className="flex flex-col gap-3">
            <input
              className="border p-2 rounded"
              placeholder="이름"
              value={orderer.name}
              onChange={(e) => setOrderer({ ...orderer, name: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="휴대전화"
              value={orderer.phone}
              onChange={(e) => setOrderer({ ...orderer, phone: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="이메일"
              value={orderer.email}
              onChange={(e) => setOrderer({ ...orderer, email: e.target.value })}
            />
          </div>
        </div>

        {/* 배송지 정보 */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">배송지 정보</h3>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsOrderer}
                onChange={() => setSameAsOrderer(!sameAsOrderer)}
              />
              주문자 정보와 동일
            </label>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            <input
              className="border p-2 rounded"
              placeholder="받는 사람"
              value={shipping.receiver}
              onChange={(e) =>
                setShipping({ ...shipping, receiver: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="휴대전화"
              value={shipping.phone}
              onChange={(e) =>
                setShipping({ ...shipping, phone: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="주소"
              value={shipping.address}
              onChange={(e) =>
                setShipping({ ...shipping, address: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="배송 메모 (선택)"
              value={shipping.memo}
              onChange={(e) =>
                setShipping({ ...shipping, memo: e.target.value })
              }
            />
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">주문 상품</h3>

          {isFromCart
            ? selectedItems.map((item) => (
                <div key={item.id} className="mb-4">
                  <p className="font-semibold">
                    {item.productName} ({item.size}/{item.color})
                  </p>
                  <p>수량: {item.count}개</p>
                  <p>{(item.productPrice * item.count).toLocaleString()}원</p>
                </div>
              ))
            : selectedItems.map((opt) => (
                <div key={opt.id} className="mb-4">
                  <p className="font-semibold">
                    {product.name} ({opt.size}/{opt.color})
                  </p>
                  <p>수량: {opt.quantity}개</p>
                  <p>
                    {(opt.quantity * product.price).toLocaleString()}원
                  </p>
                </div>
              ))}

          <div className="text-right font-bold mt-4">
            상품 금액: {totalAmount.toLocaleString()}원
          </div>

          <div className="text-right font-bold mt-1">
            배송비: 0원 (무료배송)
          </div>

          <div className="text-right text-xl font-bold mt-3">
            총 결제금액: {finalAmount.toLocaleString()}원
          </div>
        </div>

        {/* 결제하기 */}
        <button
          onClick={handlePayment}
          className="bg-black text-white p-4 rounded-xl w-full text-lg"
        >
          결제하기
        </button>
      </div>
    </MainLayout>
  );
};

export default OrderSheetPage;
