import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import Slider from 'react-slider';
import { Link } from 'react-router-dom';
import { useSearch } from "../../../SearchContext";
import axiost from "../../../axiosConfig.js";
import { ClipLoader } from 'react-spinners';

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
        const response = await axiost.get(`${process.env.REACT_APP_API_BASE_URL}/genre/get-all-genres`);
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
      <Link to={"/top-rated-books"}> <li> Top Rated Books </li></Link>
      <Link to={"/most-wished-for-books"}> <li> Most Wished For Books </li> </Link> 
      </ul>
      <br />
      <ul className="categories">
        {loading ? (
          <li><ClipLoader color="#007bff" size={20} /></li>
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