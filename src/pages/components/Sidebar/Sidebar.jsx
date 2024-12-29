import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import Slider from 'react-slider';
import { Link } from 'react-router-dom';
import { useSearch } from "../../../SearchContext";
import axios from 'axios';

const Sidebar = () => {
  const {
    genreFilter,
    setGenreFilter,
    priceRange,
    setPriceRange,
    ratingRange,
    setRatingRange
  } = useSearch();

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/genre/get-all-genres`);
        const sortedGenres = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setGenres(sortedGenres);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const topCategories = [
    "Best Seller Books",
    "Most Interested Books",
    "Top Rated Books",
  ];

  const changeSelection = (genreName) => {
    if (genreFilter.includes(genreName)) {
      setGenreFilter(genreFilter.filter((item) => item !== genreName));
    }
    else {
      setGenreFilter([...genreFilter, genreName]);
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
        {loading ? (
          <li>Loading genres...</li>
        ) : (
          genres.map((genre) => (
            <li
              key={genre.id}
              className={genreFilter.includes(genre.name) ? "selected" : ""}
              onClick={() => changeSelection(genre.name)}
            >
              {genre.name}
            </li>
          ))
        )}
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