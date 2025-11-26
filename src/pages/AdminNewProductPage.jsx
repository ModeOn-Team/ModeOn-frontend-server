// AdminNewProductPage.jsx
import { useState, useEffect } from "react";
import ProductForm from "../components/admin/ProductForm";
import ProductVariantForm from "../components/admin/ProductVariantForm";
import ProductImageForm from "../components/admin/ProductImageForm";
import useAdminStore from "../store/adminStore";
import useProductStore from "../store/ProductStore";

const AdminNewProductPage = () => {
  const { ProductCreate, ProductImage, ProductVariantCreateToNaver } =
    useAdminStore();
  const {
    ProductUploadToNaver,
    ProductImageUploadToNaver,
    ProductVariantFetch,
  } = useProductStore();

  // 1. 부모에서 모든 상태 관리
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [selectedDepth0, setSelectedDepth0] = useState(null);
  const [selectedDepth1, setSelectedDepth1] = useState(null);
  const [selectedDepth2, setSelectedDepth2] = useState(null);

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [optionValues, setOptionValues] = useState({});
  const [optionMeta, setOptionMeta] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [variantList, setVariantList] = useState([]);

  const [uploadToNaver, setUploadToNaver] = useState(false);

  const [variantOptions, setVariantOptions] = useState(null);

  useEffect(() => {
    if (!selectedDepth2) return;

    const fetchOptions = async () => {
      const options = await ProductVariantFetch(selectedDepth2);
      setVariantOptions(options);
      setVariantList([]);
    };

    fetchOptions();
  }, [selectedDepth2]);

  // 2. Save 버튼 클릭 시 처리
  const handleSaveProduct = async () => {
    const categoryId = selectedDepth2 ?? selectedDepth1 ?? selectedDepth0;

    if (!categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (price % 10 !== 0) {
      alert("가격은 10원 단위로 입력해주세요.");
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

      for (const v of variantList) {
        await ProductVariantCreateToNaver(productId, v);
      }

      const formData = new FormData();

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => formData.append("images", file));
      }

      if (uploadToNaver) {
        if (imageFiles.length > 0) {
          // 이미지 업로드 후 URL 받기
          const responseImageDto = await ProductImageUploadToNaver(formData);
          await ProductUploadToNaver(productId, responseImageDto);
        } else {
          alert("네이버 업로드를 위해 이미지를 선택해주세요.");
          return;
        }
      }

      if (imageFiles.length > 0) {
        formData.append("productId", String(productId));
        await ProductImage(formData);
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
        variantOptions={variantOptions}
        optionValues={optionValues}
        setOptionValues={setOptionValues}
        optionMeta={optionMeta}
        setOptionMeta={setOptionMeta}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
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
