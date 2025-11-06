import { useState } from "react";
import useAdminStore from "../../store/adminStore";

const ProductForm = ({ isOpen, onClose, categories }) => {
  if (!isOpen) return null;

  const { ProductCreate, ProductImage } = useAdminStore();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");

  const [selectedDepth0, setSelectedDepth0] = useState(null);
  const [selectedDepth1, setSelectedDepth1] = useState(null);
  const [selectedDepth2, setSelectedDepth2] = useState(null);

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const depth0Categories = categories.filter((cat) => cat.depth === 0);
  const depth1Categories = categories.filter(
    (cat) => cat.depth === 1 && cat.parentId === selectedDepth0
  );
  const depth2Categories = categories.filter(
    (cat) => cat.depth === 2 && cat.parentId === selectedDepth1
  );

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImages([...images, URL.createObjectURL(file)]);
    setImageFiles([...imageFiles, file]);
  };

  const renderDepthColumn = (depthCategories, selectedId, setSelected) => (
    <div className="flex flex-col flex-1 p-2 border-r border-gray-300">
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
    let categoryId = selectedDepth2 ?? selectedDepth1 ?? selectedDepth0;

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

      onClose(); 
    } catch (err) {
      console.error("에러 발생:", err);
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
        <h2 className="text-lg font-bold mb-4">Add New Product</h2>

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

          <div className="flex flex-col gap-2 mt-4">
            <label className="font-medium">Images</label>
            <div className="text-sm font-medium">first image is Thumbnail</div>
            <div className="flex gap-2 flex-wrap">
              {images.length > 0 && (
                <div>
                  <img
                    src={images[0]}
                    alt="Thumbnail"
                    className="w-32 h-32 object-cover border mb-2"
                  />
                </div>
              )}

              {images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Detail ${idx + 1}`}
                  className="w-24 h-24 object-cover border"
                />
              ))}

              <label className="w-24 h-24 flex items-center justify-center border cursor-pointer text-gray-500 hover:bg-gray-100">
                + Add
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
        >
          ×
        </button>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveProduct}
            className="bg-black text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
