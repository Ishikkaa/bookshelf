import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="nav-search-wrapper">
      <div className="nav-search-inner">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="nav-search-input"
          placeholder="Search by title..."
        />
      </div>
    </div>
  );
};

export default SearchBar;
