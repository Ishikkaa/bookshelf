import React, { useState, useRef, useEffect } from "react";
import { FiSettings, FiShoppingCart, FiUser, FiChevronDown } from "react-icons/fi";
import SearchBar from "../search/SearchBar";
import { setSearchQuery } from "../../store/features/SearchSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { selectCartCount } from "../../store/features/CartSlice";
import { logoutUser } from "../services/AuthService";

const Navbar = () => {
  const userId = localStorage.getItem("userId");
  const roles = useSelector((state) => state.auth.roles);
  const isAdmin = roles?.includes("ROLE_ADMIN");
  const dispatch = useDispatch();
  const location = useLocation();
  const showSearchBar = location.pathname === "/library";
  const cartCount = useSelector(selectCartCount);
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <nav className="custom-navbar d-flex align-items-center justify-content-between px-4">

      {/* LEFT Brand */}
      <Link to="/home" className="brand-title">BookShelf</Link>

      {/* CENTER Searchbar */}
      {showSearchBar && (
        <SearchBar
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      )}

      {/* RIGHT Options */}
      <div className="nav-options d-flex align-items-center">

        {/* Manage */}
        {isAdmin && (
          <Link to={`/user/${userId}/manage`} className="nav-link-custom d-flex align-items-center">
            <FiSettings className="nav-icon" />
            <span>Manage</span>
          </Link>
        )}
        {/* Cart */}
        <Link
          to={`/user/${userId}/cart`}
          className="nav-link-custom d-flex align-items-center position-relative"
        >
          <FiShoppingCart className="nav-icon" />
          <span>Cart</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* Account Dropdown */}
        <div className="account-dropdown" ref={accountRef}>
          <button
            className="nav-link-custom d-flex align-items-center account-btn"
            onClick={() => setAccountOpen((prev) => !prev)}
          >
            <FiUser className="nav-icon" />
            <span>Account</span>
            <FiChevronDown
              className={`dropdown-arrow ${accountOpen ? "open" : ""}`}
            />
          </button>

          {accountOpen && (
            <div className="dropdown-menu-custom">
              <Link to={`/user/${userId}/my-profile`} className="dropdown-item">My Profile</Link>
              <hr/>
              <Link to={`/user/${userId}/my-orders`} className="dropdown-item">My Orders</Link>
              <hr/>
              <Link className="dropdown-item" onClick={handleLogout}>Logout</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
