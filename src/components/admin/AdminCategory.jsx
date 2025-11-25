import { useEffect, useState } from "react";
import useCategoryStore from "../../store/categoryStore";
import CategoryForm from "./CategoryForm";

const AdminCategory = () => {
  const { categoryByDepth, getChildCategory, CreateCategory } =
    useCategoryStore();
  const [selectedDepth0, setSelectedDepth0] = useState(null);
  const [selectedDepth1, setSelectedDepth1] = useState(null);

  const [modalInfo, setModalInfo] = useState({
    open: false,
    parentId: null,
    selectedPath: [],
    depth: 0,
  });

  useEffect(() => {
    getChildCategory();
  }, []);

  const handleClickDepth0 = (cat) => {
    setSelectedDepth0(cat.id);
    setSelectedDepth1(null);
    getChildCategory(cat.id);
  };

  const handleClickDepth1 = (cat) => {
    setSelectedDepth1(cat.id);
    getChildCategory(cat.id);
  };

  const openModal = (depth, parentId) => {
    let selectedPath = [];
    if (depth === 1 && parentId) {
      const parentCat = categoryByDepth["root"].find((c) => c.id === parentId);
      selectedPath = parentCat ? [parentCat.name] : [];
    } else if (depth === 2 && parentId) {
      const parentCat = categoryByDepth[selectedDepth0].find(
        (c) => c.id === parentId
      );
      const grandParentCat = categoryByDepth["root"].find(
        (c) => c.id === selectedDepth0
      );
      selectedPath =
        grandParentCat && parentCat
          ? [grandParentCat.name, parentCat.name]
          : [];
    }
    setModalInfo({ open: true, parentId, selectedPath, depth });
  };

  const closeModal = () => setModalInfo({ ...modalInfo, open: false });

  const handleSaveCategory = async (parentId, name) => {
    console.log("Save Category:", { parentId, name });
    if (parentId == 0) parentId = null;
    CreateCategory(parentId, name);
    await getChildCategory(parentId);
    closeModal();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>
      <div className="flex border border-gray-300 rounded overflow-hidden justify-between">
        {/* Depth 0 */}
        <div className="flex flex-col w-1/3 p-2 border-r border-gray-300 min-h-[1000px] max-h-[400px] justify-between">
          <div className="overflow-y-auto flex flex-col">
            {categoryByDepth["root"]?.map((cat) => (
              <button
                key={cat.id}
                className={`p-2 text-left rounded ${
                  selectedDepth0 === cat.id
                    ? "text-red-500 font-bold"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => handleClickDepth0(cat)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <button
            className="mt-2 px-2 py-1 rounded text-white bg-black hover:bg-amber-900"
            onClick={() => openModal(0, null)}
          >
            Add
          </button>
        </div>

        {/* Depth 1 */}
        <div className="flex flex-col w-1/3 p-2 border-r border-gray-300 min-h-[1000px] max-h-[400px] justify-between">
          <div className="overflow-y-auto flex flex-col">
            {selectedDepth0 &&
              categoryByDepth[selectedDepth0]?.map((cat) => (
                <button
                  key={cat.id}
                  className={`p-2 text-left rounded ${
                    selectedDepth1 === cat.id
                      ? "text-red-500 font-bold"
                      : "text-gray-400 hover:text-black"
                  }`}
                  onClick={() => handleClickDepth1(cat)}
                >
                  {cat.name}
                </button>
              ))}
          </div>
          <button
            className={`mt-2 w-full px-2 py-1 rounded text-white ${
              selectedDepth0
                ? "bg-black hover:bg-amber-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!selectedDepth0}
            onClick={() => selectedDepth0 && openModal(1, selectedDepth0)}
          >
            Add
          </button>
        </div>

        {/* Depth 2 */}
        <div className="flex flex-col w-1/3 p-2 min-h-[1000px] max-h-[400px] justify-between">
          <div className="overflow-y-auto flex flex-col">
            {selectedDepth1 &&
              categoryByDepth[selectedDepth1]?.map((cat) => (
                <div key={cat.id} className="p-2 text-gray-400">
                  {cat.name}
                </div>
              ))}
          </div>
          <button
            className={`mt-2 w-full px-2 py-1 rounded text-white ${
              selectedDepth1
                ? "bg-black hover:bg-amber-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!selectedDepth1}
            onClick={() => selectedDepth1 && openModal(2, selectedDepth1)}
          >
            Add
          </button>
        </div>
      </div>

      {modalInfo.open && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <CategoryForm
            parentId={modalInfo.parentId}
            selectedPath={modalInfo.selectedPath}
            onSave={handleSaveCategory}
            onClose={closeModal}
          />
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
