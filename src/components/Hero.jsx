import { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
const slides = [
  {
    name: "Welcome to the Event Hub",
    image:
      "https://artisansofbarossa.com/cdn/shop/articles/discover-our-wonderful-business-function-venues-designed-for-memorable-moments.jpg?v=1707110132&width=1200",
    title: "Memorable Moments",
    subtitle: "We create unforgettable experiences for every occasion.",
  },
  {
    name: "Welcome to the Event Hub",
    image:
      "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=1600&q=80",
    title: "Elegant Weddings",
    subtitle: "From vows to celebrations, we perfect every detail.",
  },
  {
    name: "Welcome to the Event Hub",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1600&q=80",
    title: "Corporate Events",
    subtitle: "Professional event planning that leaves a lasting impression.",
  },
  {
    name: "Welcome to the Event Hub",
    image:
      "https://images.pexels.com/photos/433452/pexels-photo-433452.jpeg?cs=srgb&dl=pexels-pixabay-433452.jpg&fm=jpg",
    title: "Cultural Celebrations",
    subtitle: "Celebrate life’s milestones with creativity and flair.",
  },
];

const Hero = () => {
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

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ margin: 0 }}>
      <section className="relative h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden m-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <h1
                  className="text-4xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-10"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {slide.name}
                </h1>{" "}
                <h1 className="text-2xl mt-8 md:text-3xl lg:text-5xl font-bold tracking-tighter uppercase mb-4">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-lg tracking-tight mb-6 max-w-xl mx-auto">
                  {slide.subtitle}
                </p>
                {token ? (
                  <Link
                    to="collection/:collection"
                    className="bg-white text-gray-950 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Shop Now
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-white text-gray-950 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Hero;
