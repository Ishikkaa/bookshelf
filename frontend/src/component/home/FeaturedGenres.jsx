import React from "react";
import { Link } from "react-router-dom";

import fictionImg from "../../assets/genre-images/fictionImg.jpg";
import romanceImg from "../../assets/genre-images/romanceImg.jpg";
import thrillerImg from "../../assets/genre-images/thrillerImg.jpeg";
import scienceImg from "../../assets/genre-images/scienceImg.jpg";
import fantasyImg from "../../assets/genre-images/fantasyImg.jpg";
import SelfHelp from "../../assets/genre-images/SelfHelp.jpg"

const genres = [
  { id: 1, name: "Fiction", img: fictionImg },
  { id: 2, name: "Romance", img: romanceImg },
  { id: 3, name: "Thriller", img: thrillerImg },
  { id: 4, name: "Self Help", img: SelfHelp },
  { id: 5, name: "Science", img: scienceImg },
  { id: 6, name: "Fantasy", img: fantasyImg },
];

const FeaturedGenres = () => {
  return (
    <section className="featured-genres-container">
      <h2 className="genre-heading">FEATURED GENRES</h2>
      <div className="genre-cards-row">
        {genres.map((genre) => (
          <Link to={`/library?genre=${encodeURIComponent(genre.name)}`} key={genre.id} className="genre-card">
            <img src={genre.img} alt={genre.name} className="genre-card-img" />
            <div className="genre-overlay">
              <span className="genre-name">{genre.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGenres;
