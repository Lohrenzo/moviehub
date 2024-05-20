import React, { useEffect, useState } from "react";

//Icons
import { FaTrashCan, FaPenToSquare, FaStar } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";

// React Router Dom
import { useNavigate, useLocation } from "react-router-dom";

// Axios
import axios from "../apiRequest/axios";

import { xmlToJsonObject, textToJsonObject } from "../utils/formatter";

// Zustand
import {
  useFeedbackStore,
  useFilmsStore,
  useUpdatePopUpStore,
} from "../store/store";

// URLs
const Film_URL = "/film";

import { humanizeDate } from "../utils/formatter";

const FilmDetails = () => {
  const location = useLocation();
  const [film, setFilm] = useState({});
  const id = location.state.id;
  const nav = useNavigate();
  const [optionPopUp, setOptionPopUp] = useState(false);
  const { fetchFilms, acceptHeader, deleteButtonClick } = useFilmsStore();
  const { updatePopUp, openUpdatePopup, closeUpdatePopup } =
    useUpdatePopUpStore();
  const { openFeedbackPopup } = useFeedbackStore();
  const [date, setDate] = useState(null);

  // const removeSpacesAndSlashes = (str) => str.replace(/[\s/]/g, "-");

  const fetchFilmById = async () => {
    const response = await axios.get(`${Film_URL}?id=${id}`);

    let responseData = response?.data || {};

    // if (acceptHeader === "application/xml") {
    //   responseData = xmlToJsonObject(responseData);
    // }

    // if (acceptHeader === "text/plain") {
    //   responseData = textToJsonObject(responseData);
    // }

    setFilm({ ...location.state, ...responseData });
  };

  useEffect(() => {
    fetchFilmById();
  }, [id, acceptHeader]);

  useEffect(() => {
    setDate(film.lastModified);
  }, [film.lastModified]);

  useEffect(() => {
    console.log("Fetched film: ", film);
    console.log("Date: ", film.lastModified);
    setUpdatedFilmJson({
      id: film.id,
      title: film.title,
      year: film.year,
      stars: film.stars,
      director: film.director,
      review: film.review,
    });
    console.log("Updated film: ", updatedFilmJson);
  }, [film]);

  const [updatedFilmJson, setUpdatedFilmJson] = useState({});

  function handleTitleChange(e) {
    setUpdatedFilmJson({
      ...updatedFilmJson, // Copy the old fields (Not neccesary but advisable)
      title: e.target.value, // But Override this field
    });
  }

  function handleYearChange(e) {
    setUpdatedFilmJson({
      ...updatedFilmJson, // Copy the old fields (Not neccesary but advisable)
      year: e.target.value, // But Override this field
    });
  }

  function handleDirectorChange(e) {
    setUpdatedFilmJson({
      ...updatedFilmJson, // Copy the old fields (Not neccesary but advisable)
      director: e.target.value, // But Override this field
    });
  }

  function handleStarsChange(e) {
    setUpdatedFilmJson({
      ...updatedFilmJson, // Copy the old fields (Not neccesary but advisable)
      stars: e.target.value, // But Override this field
    });
  }

  function handleReviewChange(e) {
    setUpdatedFilmJson({
      ...updatedFilmJson, // Copy the old fields (Not neccesary but advisable)
      review: e.target.value, // But Override this field
    });
  }

  const editFilm = async () => {
    try {
      await axios.put("/", updatedFilmJson, {
        headers: { Accept: acceptHeader },
      });
      console.log(`${updatedFilmJson.title} updated!`);
      fetchFilms();
      nav("/");

      openFeedbackPopup(
        `${updatedFilmJson.title} has been updated!`,
        "rgb(0 0 0 / 0.5)",
        "#ffffff"
      );
      setOptionPopUp(false);
      closeUpdatePopup();
    } catch (error) {
      console.error("Error updating film:", error);
      openFeedbackPopup(`Error updating film`, "#9da500b9", "#000000");
    }
  };

  return (
    <section className="sm:px-12 px-6 py-3 bg-[#000000be] mb-3 relative">
      <div className="sm:grid grid-cols-3 flex flex-col gap-[3.4rem] sm:h-[80vh]">
        <img
          src={film.imgSrc}
          className="object-cover sm:h-[80vh] h-[50vh] w-full rounded-md"
          alt=""
        />
        <div className=" col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold lg:text-5xl md:text-4xl sm:text-3xl text-xl">
                {film.title}
              </h2>
              <p className="mb-2 text-gray-400">{film.year}</p>
            </div>
            <div className="flex flex-row sm:gap-4 gap-2 justify-between items-center sm:text-2xl text-xl">
              <FaStar className=" text-[yellow]" />{" "}
              <p>
                {Math.floor(film.rating)}
                <span className="text-white/65 sm:text-xl text-base">/10</span>
              </p>{" "}
            </div>
          </div>
          <div className=" overflow-y-hidden max-h-[60vh] sm:text-base text-sm">
            <p className="overflow-y-auto text-justify tracking-wider leading-relaxed mb-4 max-h-[30vh]">
              {film.review}
            </p>
            <p className="mb-2 pt-2 pb-2 border-b">
              <span className="text-gray-300">Director:</span> {film.director}
            </p>
            <p className="mb-2 pt-2 pb-2 border-b">
              <span className="text-gray-300">Stars:</span> {film.stars}
            </p>
            {/* {date ? (
              <p className="mb-2 pt-2 pb-2 border-b text-gray-400">
                <span>
                  {film.added !== film.lastModified ? "Updated " : "Added "}
                </span>
                {humanizeDate(film.lastModified, acceptHeader)}
              </p>
            ) : (
              <p className="mb-2 pt-2 pb-2 border-b text-gray-400">
                Loading...
              </p>
            )} */}
          </div>
        </div>
      </div>
      <div
        onClick={() => setOptionPopUp(!optionPopUp)}
        className="cursor-pointer bg-black/25 rotate-90 hover:scale-110 transition-all duration-150 p-1 rounded-full sm:text-[1.7rem] text-white/90 absolute sm:top-8 top-5 sm:left-16 left-8"
      >
        <SlOptions />
      </div>

      {optionPopUp && (
        <div
          className={`*:px-3 z-10 rounded-md absolute sm:text-lg sm:top-7 top-12 sm:left-28 left-7 backdrop-blur text-black bg-white/40 sm:w-36 w-28`}
        >
          <p
            className="cursor-pointer hover:bg-black/80 hover:text-white rounded-t-md flex flex-row items-center justify-between py-2"
            onClick={openUpdatePopup}
          >
            Edit <FaPenToSquare />
          </p>
          <p
            className="cursor-pointer hover:bg-[#d20000a3] hover:text-white rounded-b-md flex flex-row items-center justify-between py-2"
            onClick={() => deleteButtonClick(film.id, film.title)}
          >
            Delete <FaTrashCan />
          </p>
        </div>
      )}

      <div
        className={`fixed top-0 left-0 right-0 h-[100vh] py-4 sm:px-20 ${
          updatePopUp ? "visible" : "invisible"
        } flex flex-col gap-8 items-center justify-center bg-black/50 backdrop-blur-md z-40`}
      >
        <div className="*:mb-2 mx-auto w-full p-6 rounded-lg scale-[0.85] ">
          <h2 className="text-3xl text-center w-full font-bold text-white">
            Update {film.title}
          </h2>
          <label htmlFor="title">Title:</label>
          <input
            required
            type="text"
            onChange={handleTitleChange}
            value={updatedFilmJson.title}
            name="title"
            id="title"
            placeholder="TITLE"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full uppercase"
          />
          <label htmlFor="year">Year:</label>
          <input
            required
            type="number"
            onChange={handleYearChange}
            value={updatedFilmJson.year}
            name="year"
            id="year"
            placeholder="YEAR"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full"
          />
          <label htmlFor="director">Director:</label>
          <input
            required
            type="text"
            onChange={handleDirectorChange}
            value={updatedFilmJson.director}
            name="director"
            id="director"
            placeholder="DIRECTOR"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full uppercase"
          />
          <label htmlFor="stars">Stars:</label>
          <input
            required
            type="text"
            onChange={handleStarsChange}
            value={updatedFilmJson.stars}
            name="stars"
            id="stars"
            placeholder="STARS"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full uppercase"
          />
          <label htmlFor="review">Review:</label>
          <textarea
            required
            name="review"
            id="review"
            value={updatedFilmJson.review}
            onChange={handleReviewChange}
            placeholder="REVIEW"
            rows="10"
            className="p-2 border border-gray-700 active:border-[#0000a2] rounded-lg w-full"
          ></textarea>
          <div className="full flex justify-between gap-x-4">
            <p
              onClick={editFilm}
              className="cursor-pointer bg-transparent font-extrabold text-lg border border-white text-white hover:text-black mb-4 px-8 py-2 hover:bg-white/90 transition-all duration-125 sm:px-8 sm:py-3 rounded-lg"
            >
              Update
            </p>
            <p
              onClick={() => {
                setOptionPopUp(false);
                closeUpdatePopup();
              }}
              className="cursor-pointer bg-transparent font-extrabold text-lg border border-[#d20000e2] text-[#d20000] hover:text-white mb-4 px-8 py-2 hover:bg-[#d20000] transition-all duration-125 sm:px-8 sm:py-3 rounded-lg"
            >
              Cancel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilmDetails;
