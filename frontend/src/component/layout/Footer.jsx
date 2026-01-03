import React from "react";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Bookshelf. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
