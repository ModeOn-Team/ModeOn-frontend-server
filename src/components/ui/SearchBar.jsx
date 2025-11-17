import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchBar = ({ placeholder = "검색어를 입력하세요", onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search?word=" + keyword);
    console.log(keyword);
    if (onSearch) onSearch(keyword.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center gap-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all px-4 py-2"
    >
      <input
        type="text"
        value={keyword}
        placeholder={placeholder}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-1 focus:outline-none text-gray-800 placeholder-gray-400"
      />

      <button type="submit"></button>
    </form>
  );
};

export default SearchBar;
