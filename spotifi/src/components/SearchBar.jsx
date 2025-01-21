import React, { useState } from "react";

export default function SearchBar({ handleSearch }) {
  const [query, setQuery] = useState("");
  const [exactMatch, setExactMatch] = useState(false);

  return (
    <div id="search-bar" className="p-4">
      <form
        id="search-form"
        className="flex items-center space-x-4"
        onSubmit={(event) => handleSearch(event, query, exactMatch)}
      >
        {/* Input Field */}
        <input
          id="search-input"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search Button */}
        <button
          id="search-btn"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
          type="submit"
        >
          <i className="fa fa-search text-xl"></i>
        </button>

        {/* Exact Match Checkbox */}
        <section id="exact-parent" className="flex items-center space-x-2">
          <input
            id="exact-search"
            type="checkbox"
            checked={exactMatch}
            onChange={(e) => setExactMatch(e.target.checked)}
            className="form-checkbox text-blue-500"
          />
          <label htmlFor="exact-search" className="text-sm text-gray-700">
            Exact
          </label>
        </section>
      </form>
    </div>
  );
}
