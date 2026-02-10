import { Search } from "lucide-react";

export default function CompanySearch({ searchQuery, handleSearchChange }) {
  return (
    <div className="toolbar fade-in">
      <div className="search-box">
        <Search size={20} className="search-icon" />
        <input
          className="input"
          type="text"
          placeholder="Search company by name or location"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}
