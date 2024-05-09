import React, { useState, useEffect } from "react";

// Axios
import axios from "../apiRequest/axios";
// Icons
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { FaAnglesUp } from "react-icons/fa6";

// React Router Dom
import { Link, useLocation, useNavigate } from "react-router-dom";

// Zustand
import { useFeedbackStore, useFilmsStore } from "../store/store";

// URLs
const Films_URL = "films";

const Navbar = () => {
  const { fetchFilms, setAcceptHeader, acceptHeader } = useFilmsStore();
  const location = useLocation();
  const nav = useNavigate();

  const [openPopup, setOpenPopup] = useState(false);
  const [showUpButton, setShowUpButton] = useState(false);
  const { openFeedbackPopup } = useFeedbackStore();
  const [newFilmJson, setNewFilmJson] = useState({
    title: "",
    year: "",
    director: "",
    stars: "",
    review: "",
  });

  function handleTitleChange(e) {
    setNewFilmJson({
      ...newFilmJson, // Copy the old fields (Not neccesary but advisable)
      title: e.target.value, // But Override this field
    });
  }

  function handleYearChange(e) {
    setNewFilmJson({
      ...newFilmJson, // Copy the old fields (Not neccesary but advisable)
      year: e.target.value, // But Override this field
    });
  }

  function handleDirectorChange(e) {
    setNewFilmJson({
      ...newFilmJson, // Copy the old fields (Not neccesary but advisable)
      director: e.target.value, // But Override this field
    });
  }

  function handleStarsChange(e) {
    setNewFilmJson({
      ...newFilmJson, // Copy the old fields (Not neccesary but advisable)
      stars: e.target.value, // But Override this field
    });
  }

  function handleReviewChange(e) {
    setNewFilmJson({
      ...newFilmJson, // Copy the old fields (Not neccesary but advisable)
      review: e.target.value, // But Override this field
    });
  }

  function handleAcceptHeaderChange(e) {
    setAcceptHeader(e.target.value);
  }

  const addFilm = async () => {
    try {
      await axios.post(Films_URL, newFilmJson);
      console.log(newFilmJson.title + " has been added.");
      openFeedbackPopup(
        newFilmJson.title + " has been added.",
        "000000dc",
        "#ffffff"
      );
    } catch (error) {
      openFeedbackPopup("Something went wrong!!", "000000dc", "#ffffff");
      console.error("Error adding film: ", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (
      newFilmJson ==
      {
        title: "",
        year: "",
        director: "",
        stars: "",
        review: "",
      }
    ) {
      openFeedbackPopup("Fields Can't Be Empty", "yellow", "#000000");
      console.log("Fields Can't Be Empty");
    } else {
      try {
        addFilm();
        fetchFilms();
        setNewFilmJson({
          title: "",
          year: "",
          director: "",
          stars: "",
          review: "",
        });
        setOpenPopup(false);
      } catch {
        console.log("Error Adding This Film");
        openFeedbackPopup("Something went wrong!!", "#000000dc", "#ffffff");
      }
    }
  };

  const toggleScrollToTopButton = () => {
    if (window.scrollY > 70) {
      setShowUpButton(true);
    } else {
      setShowUpButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleScrollToTopButton);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", toggleScrollToTopButton);
    };
  }, []);

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="backdrop-blur-md bg-black/90 text-white z-40 sticky top-0 left-0 right-0 shadow w-full flex flex-row items-center justify-between px-4 py-6 mb-6">
        <Link
          to="/"
          className="p-2 font-bold lg:text-lg md:text-lg sm:text-base text-[0.8rem]"
        >
          Films App (API)
        </Link>
        {location.pathname == "/" && (
          <div>
            <select
              id="format"
              className="text-white bg-transparent p-2 cursor-pointer sm:text-base text-[0.7rem]"
              defaultValue={acceptHeader}
              onChange={handleAcceptHeaderChange}
            >
              <option value="application/json" className="text-black p-2">
                JSON Format
              </option>
              <option value="application/xml" className="text-black p-2">
                XML Format
              </option>
              <option value="text/plain" className="text-black p-2">
                Text Format
              </option>
            </select>
          </div>
        )}
        <button
          onClick={() => setOpenPopup(true)}
          id="open-add-popup"
          className="relative sm:p-2 font-bold group/popup sm:text-base text-[0.7rem] flex flex-row items-center justify-center gap-2"
        >
          Add New Film <FaPlus />
          <p className="invisible group-hover/popup:visible absolute right-0 top-10 bg-white/55 backdrop-blur-sm rounded-s-full rounded-br-full rounded-tr-full text-black p-1 font bold w-[150px]">
            Add New Film
          </p>
        </button>
      </div>

      <div
        id="add-popup"
        className={`${
          openPopup && "active"
        } z-50 py-6 md:px-24 mx-auto fixed top-0 w-full h-[100vh] bg-black/70`}
      >
        <button
          onClick={() => setOpenPopup(false)}
          id="close-add-popup"
          className="absolute sm:top-8 top-3 right-8 w-[30px] h-[30px] flex items-center justify-center rounded-lg text-3xl font-bold bg-white/80 duration-150 hover:scale-125 transition-all hover:rotate-180 text-black"
        >
          <IoClose />
        </button>
        <form
          action="films"
          method="POST"
          className="*:mb-5 add-popup-body mx-auto w-full p-6 rounded-lg shadow-lg shadow-[#00000081]"
        >
          <h2 className="sm:text-3xl text-center w-full font-bold text-white">
            Add New Film
          </h2>
          <input
            required
            type="text"
            onChange={handleTitleChange}
            value={newFilmJson.title}
            name="title"
            placeholder="TITLE"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full uppercase"
          />
          <input
            required
            type="number"
            onChange={handleYearChange}
            value={newFilmJson.year}
            name="year"
            placeholder="YEAR"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full"
          />
          <input
            required
            type="text"
            onChange={handleDirectorChange}
            value={newFilmJson.director}
            name="director"
            placeholder="DIRECTOR"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full uppercase"
          />
          <input
            required
            type="text"
            onChange={handleStarsChange}
            value={newFilmJson.stars}
            name="stars"
            placeholder="STARS"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full uppercase"
          />
          <textarea
            required
            name="review"
            value={newFilmJson.review}
            onChange={handleReviewChange}
            placeholder="REVIEW"
            rows="10"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full"
          ></textarea>
          <button
            onClick={handleAdd}
            className="bg-transparent font-extrabold text-lg border border-white text-white hover:text-black mb-4 px-8 py-2 hover:bg-white/90 transition-all duration-125 sm:px-8 sm:py-3 sm:w-full rounded-lg"
          >
            Add
          </button>
        </form>
      </div>

      {showUpButton && (
        <button
          onClick={toTop}
          className="z-40 fixed bg-white hover:scale-110 duration-125 transition-all border p-3 w-[2.7rem] h-[2.7rem] flex items-center justify-center rounded-full shadow sm:bottom-5 bottom-16 right-4 text-black text-2xl"
        >
          <FaAnglesUp />
        </button>
      )}
    </>
  );
};

export default Navbar;
