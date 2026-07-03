import { FiSearch } from "react-icons/fi";

function SearchBar() {
  return (
    <div className="search-box">
      <FiSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search incidents..."
      />
    </div>
  );
}

export default SearchBar;