import { useState } from "react";

const CategoryMasterDetail = ({ categories, onAddCategory }) => {
  const [selectedDepth0, setSelectedDepth0] = useState(null);
  const [selectedDepth1, setSelectedDepth1] = useState(null);

  const depth0Categories = categories.filter((cat) => cat.depth === 0);
  const depth1Categories = categories.filter(
    (cat) => cat.depth === 1 && cat.parentId === selectedDepth0
  );
  const depth2Categories = categories.filter(
    (cat) => cat.depth === 2 && cat.parentId === selectedDepth1
  );

  const renderDepthColumn = (depthCategories, selectedId, setSelected, depth, parentId) => (
    <div className="flex flex-col flex-1 p-2 border-r border-gray-300">
      {depthCategories.map((cat) => {
        const isActive = selectedId === cat.id;
        return (
          <div
            key={cat.id}
            className={`p-2 cursor-pointer rounded ${
              isActive ? "text-red-500 font-bold" : "text-gray-400 hover:text-black"
            }`}
            onClick={() => setSelected(cat.id)}
          >
            {cat.name}
          </div>
        );
      })}

      {(depth === 0 || (depth === 1 && parentId) || (depth === 2 && parentId)) && (
        <div className="flex justify-end mt-2">
          <button
            className="w-1/2 bg-black text-white px-2 py-1 rounded hover:bg-amber-900 text-sm"
            onClick={() => onAddCategory(depth, parentId)}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex border border-gray-300 rounded overflow-hidden">
      {renderDepthColumn(depth0Categories, selectedDepth0, (id) => { setSelectedDepth0(id); setSelectedDepth1(null); }, 0)}
      {renderDepthColumn(depth1Categories, selectedDepth1, setSelectedDepth1, 1, selectedDepth0)}
      {renderDepthColumn(depth2Categories, null, () => {}, 2, selectedDepth1)}
    </div>
  );
};

export default CategoryMasterDetail;
