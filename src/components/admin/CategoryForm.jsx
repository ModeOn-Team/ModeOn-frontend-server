import { useState } from "react";

const CategoryForm = ({ parentId, selectedPath = [], onSave, onClose }) => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content.trim()) return alert("내용을 입력하세요.");
    onSave(parentId, content);
    setContent("");
  };

  return (
    <div className="bg-white rounded-lg p-6 w-1/3">
      <div className="mb-4 text-gray-700 text-sm">
        {selectedPath.join(" > ")}
      </div>

      <input
        type="text"
        placeholder="Category Name"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;