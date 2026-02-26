import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const browseLib = () => {
    navigate("/library");
  };

  return (
    <div className="hero-banner-container">
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-text-box text-center">
          <h1 className="hero-heading">Escape Into Endless Stories</h1>
          <button onClick={browseLib} className="hero-btn mt-3">Browse Library</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
