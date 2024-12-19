import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [ratingRange, setRatingRange] = useState([0, 5]);

  const resetSearchQuery = () => setSearchQuery("");

  const resetFilters = () => {
    setGenreFilter([]);
    setPriceRange([0, 50]);
    setRatingRange([0, 5]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        resetSearchQuery,
        genreFilter,
        setGenreFilter,
        priceRange,
        setPriceRange,
        ratingRange,
        setRatingRange,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);