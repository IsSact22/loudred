import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder = "Buscar", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="flex items-center w-full max-w-md p-2 bg-purple-200 rounded-full focus-within:shadow-md transition-shadow duration-300">
      {/* Ícono de búsqueda */}
      <FaSearch className="text-purple-500 ml-3" />
      
      {/* Input de texto */}
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-grow ml-3 bg-transparent outline-none text-purple-700 placeholder-purple-400"
      />
    </div>
  );
};

export default SearchBar;
