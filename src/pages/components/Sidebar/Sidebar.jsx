import React, { useState } from 'react';
import './Sidebar.css';
import Slider from 'react-slider';

const Sidebar = () => {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
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

  const changeSelection = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    }
    else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  const handleRatingChange = (values) => {
    setRatingRange(values);
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
            className={selectedIndices.includes(index) ? "selected" : ""}
            onClick={() => changeSelection(index)}
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
            onChange={handlePriceChange}
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
            onChange={handleRatingChange}
            className="slider"
            trackClassName="track"
            thumbClassName="thumb"
          />
        </div>
      </div>
      <button className="search-btn">Search</button>
    </aside>
  );
}

export default Sidebar;