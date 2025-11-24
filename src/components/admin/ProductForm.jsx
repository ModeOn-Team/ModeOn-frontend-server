import { useState, useEffect } from "react";
import useAdminStore from "../../store/adminStore";
import useProductStore from "../../store/ProductStore";

const ProductForm = ({
  productName,
  setProductName,
  price,
  setPrice,
  gender,
  setGender,
  selectedDepth0,
  setSelectedDepth0,
  selectedDepth1,
  setSelectedDepth1,
  selectedDepth2,
  setSelectedDepth2,
}) => {
  const { categories, fetchCategories } = useProductStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const depth0Categories = categories.filter((cat) => cat.depth === 0);
  const depth1Categories = categories.filter(
    (cat) => cat.depth === 1 && cat.parentId === selectedDepth0
  );
  const depth2Categories = categories.filter(
    (cat) => cat.depth === 2 && cat.parentId === selectedDepth1
  );

  const renderDepthColumn = (depthCategories, selectedId, setSelected) => (
    <div className="flex flex-col flex-1 p-2 border-r border-gray-300 min-h-[300px] max-h-[300px] overflow-y-auto">
      {depthCategories.map((cat) => {
        const isActive = selectedId === cat.id;
        return (
          <div
            key={cat.id}
            className={`p-2 cursor-pointer rounded ${
              isActive
                ? "text-red-500 font-bold"
                : "text-gray-400 hover:text-black"
            }`}
            onClick={() => setSelected(cat.id)}
          >
            {cat.name}
          </div>
        );
      })}
    </div>
  );

  const handleSaveProduct = async () => {
    const categoryId = selectedDepth2 ?? selectedDepth1 ?? selectedDepth0;

    if (!categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    const product = {
      name: productName,
      price: Number(price),
      gender,
      categoryId,
    };

    try {
      const res = await ProductCreate(product);
      const productId = res.id;

      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append("productId", String(productId));
        imageFiles.forEach((file) => formData.append("images", file));
        await ProductImage(formData);
      }
    } catch (err) {
      console.error("에러 발생:", err);
      alert("상품 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border rounded p-2 flex-1"
        >
          <option value="">Gender</option>
          <option value="MAN">MAN</option>
          <option value="WOMAN">WOMAN</option>
          <option value="KIDS">KIDS</option>
        </select>

        <div className="flex border border-gray-300 rounded overflow-hidden">
          {renderDepthColumn(depth0Categories, selectedDepth0, (id) => {
            setSelectedDepth0(id);
            setSelectedDepth1(null);
            setSelectedDepth2(null);
          })}
          {renderDepthColumn(depth1Categories, selectedDepth1, (id) => {
            setSelectedDepth1(id);
            setSelectedDepth2(null);
          })}
          {renderDepthColumn(
            depth2Categories,
            selectedDepth2,
            setSelectedDepth2
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
