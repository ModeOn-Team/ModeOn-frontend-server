import { useEffect, useState } from "react";
import useAdminStore from "../../store/adminStore";
import CategoryMasterDetail from "./CategoryMasterDetail";
import CategoryForm from "./CategoryForm";
import useProductStore from "../../store/ProductStore";

const Category = () => {
  const { CreateCategory } = useAdminStore();
  const { categories, fetchCategories } = useProductStore();
  const [modalInfo, setModalInfo] = useState({
    open: false,
    depth: null,
    parentId: null,
  });

  const openModal = (depth, parentId) => {
    setModalInfo({ open: true, depth, parentId });
  };

  const closeModal = () =>
    setModalInfo({ open: false, depth: null, parentId: null });

  const handleSave = (parentId, content) => {
    if (parentId ==0 ) parentId = null;
    CreateCategory(parentId, content);
    closeModal();
  };

  const getSelectedPath = (categories, modalInfo) => {
    if (!modalInfo.parentId) return [];
    const path = [];
    let currentId = modalInfo.parentId;

    while (currentId != null) {
      const cat = categories.find((c) => c.id === currentId);
      if (!cat) break;
      path.unshift(cat.name);
      currentId = cat.parentId;
    }

    return path;
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>

      <CategoryMasterDetail categories={categories} onAddCategory={openModal} />

      {modalInfo.open && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <CategoryForm
            depth={modalInfo.depth}
            parentId={modalInfo.parentId}
            selectedPath={getSelectedPath(categories, modalInfo)}
            onSave={handleSave}
            onClose={closeModal}
          />
        </div>
      )}
    </div>
  );
};

export default Category;
