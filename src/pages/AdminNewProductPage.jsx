// AdminNewProductPage.jsx
import { useState } from "react";
import ProductForm from "../components/admin/ProductForm";
import ProductVariantForm from "../components/admin/ProductVariantForm";
import ProductImageForm from "../components/admin/ProductImageForm";
import useAdminStore from "../store/adminStore";

const AdminNewProductPage = () => {
  const { ProductCreate, ProductImage, ProductVariantCreate } = useAdminStore();

  // 1. 부모에서 모든 상태 관리
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [selectedDepth0, setSelectedDepth0] = useState(null);
  const [selectedDepth1, setSelectedDepth1] = useState(null);
  const [selectedDepth2, setSelectedDepth2] = useState(null);

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [variantList, setVariantList] = useState([]);

  const [uploadToNaver, setUploadToNaver] = useState(false);

  // 2. Save 버튼 클릭 시 처리
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
        console.log("Creating images:", formData);
      }

      for (const v of variantList) {
        await ProductVariantCreate(productId, v);
      }

      if (uploadToNaver) {
        console.log("Uploading to Naver:", productId);
        // await ProductUploadToNaver(productId);
      }
      alert("상품이 성공적으로 등록되었습니다!");
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4">
      <ProductForm
        productName={productName}
        setProductName={setProductName}
        price={price}
        setPrice={setPrice}
        gender={gender}
        setGender={setGender}
        selectedDepth0={selectedDepth0}
        setSelectedDepth0={setSelectedDepth0}
        selectedDepth1={selectedDepth1}
        setSelectedDepth1={setSelectedDepth1}
        selectedDepth2={selectedDepth2}
        setSelectedDepth2={setSelectedDepth2}
      />

      <ProductVariantForm
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        variantList={variantList}
        setVariantList={setVariantList}
      />

      <ProductImageForm
        images={images}
        setImages={setImages}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
      />

      <div className="flex flex-col items-end mt-6 gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="naverUpload"
            checked={uploadToNaver}
            onChange={(e) => setUploadToNaver(e.target.checked)}
          />
          <label htmlFor="naverUpload">네이버 쇼핑에 업로드</label>
        </div>

        <button
          onClick={handleSaveProduct}
          className="bg-black text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AdminNewProductPage;
