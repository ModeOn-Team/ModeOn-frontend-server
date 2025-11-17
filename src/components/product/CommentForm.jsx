import { useState } from "react";

const CommentForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() === "") return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 border border-gray-200 mb-4 w-3/4"
    >
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2 resize-none"
        rows={3}
        placeholder="후기를 작성해 주세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-black hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          작성
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
