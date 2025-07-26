import React, { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import userIcon from "./user_icon.png";

const Header = () => {
  const [userInitial, setUserInitial] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Get user initial
  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData.name) {
        setUserInitial(userData.name.charAt(0).toUpperCase());
      }
    }
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          
          .font-outfit {
            font-family: 'Outfit', sans-serif;
          }
          
          .font-calligraphy {
            font-family: 'Dancing Script', cursive;
          }
        `}
      </style>

      <nav className="w-full py-3 px-4 md:px-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 no-underline hover:scale-105 transition-transform"
          >
            <span className="text-3xl">🎉</span>
            <span className="font-calligraphy text-2xl bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent font-bold">
              Event Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-6">
              <Link
                to="/"
                className="group relative font-outfit font-bold font-semibold text-gray-700 text-small transition-all duration-300 no-underline"
              >
                <span className="group-hover:text-[#ea2e0e] transition-colors duration-300">
                  HOME
                </span>
                <span className="absolute left-0 bottom-0 h-0.5 bg-[#ea2e0e] w-0 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {token && (
                <Link
                  to="/bookings"
                  className="group relative font-outfit font-semibold text-gray-700 text-small transition-all duration-300 no-underline"
                >
                  <span className="group-hover:text-[#ea2e0e] transition-colors duration-300">
                    BOOKINGS
                  </span>
                  <span className="absolute left-0 bottom-0 h-0.5 bg-[#ea2e0e] w-0 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}

              <Link
                to="/events"
                className="group relative font-outfit font-bold font-semibold text-gray-700 text-small transition-all duration-300 no-underline"
              >
                <span className="group-hover:text-[#ea2e0e] transition-colors duration-300">
                  EVENTS
                </span>
                <span className="absolute left-0 bottom-0 h-0.5 bg-[#ea2e0e] w-0 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Auth section */}
            <div className="flex items-center space-x-4">
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center gap-2 font-outfit font-bold text-gray-800 transition-colors no-underline"
                    onClick={toggleDropdown}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center overflow-hidden">
                      {userInitial ? (
                        <span className="text-indigo-600 font-bold text-sm">
                          {userInitial}
                        </span>
                      ) : (
                        <img
                          src={userIcon}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-50 no-underline font-outfit font-semibold"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/events/create"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-50 no-underline font-outfit font-semibold"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Create Event
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-50 no-underline font-outfit font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2  bg-white-900 font-outfit text-gray-700 px-4 py-2 rounded-lg font-bold shadow transition-colors duration-300 hover:bg-gray-700 hover:text-white border border-transparent hover:border-neutral-900"
                >
                  <FaUser size={18} />
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-[#ea2e0e] focus:outline-none"
            >
              <svg
                className={`h-5 w-5 ${isMenuOpen ? "hidden" : "block"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-5 w-5 ${isMenuOpen ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg border-t border-gray-100">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-gray-50 no-underline font-outfit"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/bookings"
              className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-gray-50 no-underline font-outfit"
              onClick={() => setIsMenuOpen(false)}
            >
              BOOKINGS
            </Link>
            <Link
              to="/events"
              className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-gray-50 no-underline font-outfit"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>

            {/* Mobile auth section */}
            <div className="pt-3 pb-2 border-t border-gray-200">
              {token ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-500 flex items-center justify-center overflow-hidden mr-3">
                      {userInitial ? (
                        <span className="text-indigo-600 font-bold text-sm">
                          {userInitial}
                        </span>
                      ) : (
                        <img
                          src={userIcon}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="font-outfit font-bold text-gray-800">
                      My Account
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-gray-50 no-underline font-outfit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/events/create"
                    className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-gray-50 no-underline font-outfit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Event
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-gray-50 no-underline font-outfit"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 font-outfit font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                >
                  <FaUser size={18} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
