import React, { useState } from 'react';
import './Sidebar.css';
import Slider from 'react-slider';
import { Link } from 'react-router-dom';
import { useSearch } from "../../../SearchContext";

const Sidebar = () => {
  const {
    genreFilter,
    setGenreFilter,
    priceRange,
    setPriceRange,
    ratingRange,
    setRatingRange
  } = useSearch();

  const topCategories = [
    "Best Seller Books",
    "Most Interested Books",
    "Top Rated Books",
  ];
  const categories = [
    "Action & Adventure",
    "Art & Photography",
    "Biography",
    "Detective & Mystery",
    "Fantasy",
    "Food & Drink",
    "History",
    "Poetry",
    "Romance",
    "Science & Technology",
    "Science Fiction",
    "Self-Help",
    "Thriller",
    "World Classics",
  ];

  const changeSelection = (category) => {
    if (genreFilter.includes(category)) 
    {
      setGenreFilter(genreFilter.filter((item) => item !== category));
    } 
    else 
    {
      setGenreFilter([...genreFilter, category]);
    }
  };

  return (
    <aside className="sidebar">
      <ul className="categories">
        {topCategories.map((category, index) => (
          <li key={index}> {category} </li>
        ))}
      </ul>
      <br /><br />
      <ul className="categories">
        {categories.map((category, index) => (
          <li
            key={index}
            className={genreFilter.includes(category) ? "selected" : ""}
            onClick={() => changeSelection(category)}
          >
            {category}
          </li>
        ))}
      </ul>
      <div className="filters">
        <div className="filter-item">
          <div className="slider-container">
            <span className="label">Price</span>
            <span className="interval">{`$ ${priceRange[0]} - ${priceRange[1]}`}</span>
          </div>
          <Slider
            min={0}
            max={50}
            step={1}
            value={priceRange}
            onChange={setPriceRange}
            className="slider"
            trackClassName="track"
            thumbClassName="thumb"
          />
        </div>
        <div className="filter-item">
          <div className="slider-container">
            <span className="label">Rating</span>
            <span className="interval">{`★ ${ratingRange[0]} - ${ratingRange[1]}`}</span>
          </div>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={ratingRange}
            onChange={setRatingRange}
            className="slider"
            trackClassName="track"
            thumbClassName="thumb"
          />
        </div>
      </div>
      <Link to={"/search"}><button className="search-btn">Search</button> </Link>
      
    </aside>
  );
}

export default Sidebar;