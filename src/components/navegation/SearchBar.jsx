"use client";

import { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ placeholder = "Buscar", onSearch, suggestions = [] }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filtramos las sugerencias basándonos en el query
  const filteredSuggestions = useMemo(() => {
    if (!query) return [];
    return suggestions.filter((song) =>
      song.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, suggestions]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Llamamos a onSearch cada vez que cambia el input
    setShowSuggestions(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  // Cuando el usuario hace click en una sugerencia, actualizamos el input
  const handleSuggestionClick = (songTitle) => {
    setQuery(songTitle);
    onSearch(songTitle);
    setShowSuggestions(false);
  };

  return (
    // Contenedor relativo para ubicar el dropdown de sugerencias
    <div className="relative w-full max-w-md">
      <div className="flex items-center w-full p-2 bg-purple-200 rounded-full focus-within:shadow-md transition-shadow duration-300">
        <FaSearch className="text-purple-500 ml-3" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="flex-grow ml-3 bg-transparent outline-none text-purple-700 placeholder-purple-400"
        />
      </div>

      {/* Ventanita de sugerencias */}
      {showSuggestions && query && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-red-rusty/70 shadow rounded-lg border border-gray-200">
          {filteredSuggestions.map((song) => (
            <li
              key={song.id || song.title}
              onClick={() => handleSuggestionClick(song.title)}
              className="p-2 hover:bg-white hover:text-black cursor-pointer text-white font-medium"
            >
              {song.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
