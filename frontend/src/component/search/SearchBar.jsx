import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ value, onChange }) => {
  console.log("Search value:", value);
  const handleClear = () => {
    onChange({ target: { value: "" } });
  };
  return (
    <div className="nav-search-wrapper">
      <div className="nav-search-inner">
        <FaSearch className="search-icon" />

        <input
          type="text"
          value={value}
          onChange={onChange}
          className="nav-search-input"
          placeholder="Search by title, trope, or theme…"
        />

        {value && (
          <FaTimes
            className="clear-search-icon"
            onClick={handleClear}
            title="Clear search"
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
