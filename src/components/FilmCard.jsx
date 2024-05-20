import React, { useState, useEffect } from "react";

// Icons
import { FaTrashCan, FaPenToSquare } from "react-icons/fa6";
import { SlOptions } from "react-icons/sl";

// React Router Dom
import { useNavigate } from "react-router-dom";

// Zustand
import { useUpdatePopUpStore, useFilmsStore } from "../store/store";

const FilmCard = ({
  id,
  title,
  year,
  director,
  review,
  stars,
  added,
  lastModified,
}) => {
  const { deleteButtonClick } = useFilmsStore();
  const { openUpdatePopup } = useUpdatePopUpStore();

  const nav = useNavigate();
  const [popUp, setPopUp] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState("/assets/film-projector.png"); // Default image source
  const [rating, setRating] = useState("5.5");

  const truncateTitle = (str) =>
    str.length > 29 ? str.substring(0, 28) + "..." : str;
  const truncateReview = (str) =>
    str.length > 138 ? str.substring(0, 135) + "..." : str;
  const removeSpacesAndSlashes = (str) => str.replace(/[\s/]/g, "-");

  function disableRightClick(event) {
    if (event.button == 2) {
      event.preventDefault(); // Prevent the default right-click behavior
      console.log("Right click disabled!");
      return false;
    }
  }

  useEffect(() => {
    const fetchMovieImage = async () => {
      const apiKey = import.meta.env.VITE_THEMOVIEDB_API_KEY;
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        title
      )}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
          const imgPath = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
          setImgSrc(data.results[0].poster_path == null ? imgSrc : imgPath);
          setRating(
            data.results[0].vote_average == 0
              ? rating
              : data.results[0].vote_average
          );
        }
      } catch (error) {
        console.error("Failed to fetch film image:", error);
      }

      setImgLoading(false);
    };

    fetchMovieImage();
  }, [title]);

  return (
    <div key={id} className="relative shadow-xl bg-[#151515] rounded-lg">
      {imgLoading && (
        <div className="absolute z-10 rounded-lg top-0 left-0 w-full h-full flex flex-row items-center justify-center bg-[#151515ec] backdrop-blur-md gap-3">
          {/* <p className=' italic text-sm'>loading...</p> */}
          <div className="w-2 h-2 rounded-full bg-white/65 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-2 h-2 rounded-full bg-white/75 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-white/65 animate-bounce [animation-delay:.7s]"></div>
        </div>
      )}
      <div className="h-[20rem] w-[100%]">
        <img
          src={imgSrc}
          className="rounded-t-lg object-cover h-[20rem] w-[100%] cursor-pointer"
          title={`${title}`}
          onContextMenu={disableRightClick}
          alt={`${title} poster`}
          onClick={() => {
            nav(
              `/${removeSpacesAndSlashes(title)
                .substring(0, 30)
                .toLowerCase()}`,
              {
                state: {
                  id,
                  imgSrc,
                  rating,
                  // title,
                  // year,
                  // director,
                  // stars,
                  // review,
                  // added,
                  // lastModified,
                },
              }
            );
          }}
        />
      </div>
      <div className="px-6 py-3 grid grid-cols-1 relative">
        <p
          onClick={() => {
            nav(
              `/${removeSpacesAndSlashes(title)
                .substring(0, 30)
                .toLowerCase()}`,
              {
                state: {
                  id,
                  imgSrc,
                  rating,
                },
              }
            );
          }}
          className="text-center hover:text-gray-400 h-[3.6rem] border-b border-gray-400 mb-2 overflow-hidden tracking-wide lg:text-lg md:text-base text-[0.9rem] cursor-pointer font-bold data-tooltip"
          data-tooltip-content={`${title}`}
        >
          {truncateTitle(title)}
        </p>
        <p className="cursor-default text-justify text-gray-400 md:text-sm text-xs lg:text-[0.9rem] h-[6rem] w-full tracking-tight overflow-hidden mb-4">
          {truncateReview(review)}
        </p>
        <div className="flex justify-between items-center md:text-[0.7rem] sm:text-[0.55rem] text-[0.65rem] opacity-60">
          <p>Directed by {director}</p>
          <p>Year: {year}</p>
        </div>
      </div>
      <div
        onClick={() => setPopUp(!popUp)}
        className="cursor-pointer bg-white/80 hover:scale-95 transition-all duration-150 p-1 rounded-full text-xl text-black absolute top-5 right-5"
      >
        <SlOptions />
      </div>

      {popUp && (
        <div
          className={`*:px-2 z-10 rounded-md absolute top-14 right-1 backdrop-blur text-black bg-white/40 w-32`}
        >
          <p
            className="cursor-pointer hover:bg-black/80 hover:text-white rounded-t-md flex flex-row items-center justify-between"
            onClick={() => {
              openUpdatePopup();
              setPopUp(false);
              nav(
                `/${removeSpacesAndSlashes(title)
                  .substring(0, 30)
                  .toLowerCase()}`,
                {
                  state: {
                    id,
                    imgSrc,
                    rating,
                  },
                }
              );
            }}
          >
            Edit <FaPenToSquare />
          </p>
          <p
            className="cursor-pointer hover:bg-[#d20000a3] hover:text-white rounded-b-md flex flex-row items-center justify-between"
            onClick={() => {
              deleteButtonClick(id, title);
              setPopUp(false);
            }}
          >
            Delete <FaTrashCan />
          </p>
        </div>
      )}
    </div>
  );
};

export default FilmCard;
