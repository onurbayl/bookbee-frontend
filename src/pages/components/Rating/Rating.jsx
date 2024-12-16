import React from 'react';
import './Rating.css';

const Rating = ({ score }) => {
    const stars = [];
    const normalizedScore = score / 2;
  
    for (let i = 0; i < 5; i++) 
      {
        if (i < Math.floor(normalizedScore)) 
        {
          stars.push(<span key={i} className="rating-star full">★</span>);
        } 
        else if (i < normalizedScore) 
        {
          stars.push(
            <span key={i} className="rating-star half">
              <span className="rating-star-overlay">★</span>★
            </span>
          );
        } 
        else 
        {
          stars.push(<span key={i} className="rating-star empty">★</span>);
        }
      }
    
      return <div className="rating">{stars}</div>;
    };

export default Rating;