import { useState, useEffect } from "react";

// React Router
import { Routes, Route, useNavigate } from "react-router-dom";

// Axios
import axios from "./apiRequest/axios";

import { xmlToJson, textToJson } from "./utils/formatter";

//Components
import Navbar from "./components/Navbar";

// Pages
import Index from "./webpages/Index";
import FilmDetails from "./webpages/FilmDetails";

// Icons
import { IoClose } from "react-icons/io5";

// Zustand
import { useFeedbackStore, useFilmsStore } from "./store/store";

// URLs
const Films_URL = "films";

function App() {
  const nav = useNavigate();
  const [searchStr, setSearchStr] = useState("");
  const { fetchFilms, setFilms, acceptHeader, chosenFilm, cancelDeleteClick } =
    useFilmsStore();
  const {
    isOpen,
    message,
    bgColour,
    textColour,
    openFeedbackPopup,
    closeFeedbackPopup,
  } = useFeedbackStore();

  const deleteFilm = async () => {
    try {
      await axios.delete(`?id=${chosenFilm.id}`);
      console.log(`${chosenFilm.title} deleted!`);
      fetchFilms();
      // Navigate to the home page to show the updated list after deletion.
      nav("/");
      openFeedbackPopup(
        `${chosenFilm.title} has been deleted!`,
        "#c40000a1",
        "#ffffff"
      );
    } catch (error) {
      fetchFilms();
      nav("/");
      openFeedbackPopup(`Error deleting film`, "#9da500b9", "#000000");
      console.error("Error deleting film:", error);
    } finally {
      cancelDeleteClick();
    }
  };

  const searchFilms = async (searchString) => {
    if (searchString.length > 0) {
      try {
        const response = await axios.get(`?searchStr=${searchString}`, {
          headers: { Accept: acceptHeader },
        });

        let responseData = response?.data || [];

        if (acceptHeader === "application/xml") {
          responseData = xmlToJson(responseData);
        }

        if (acceptHeader === "text/plain") {
          responseData = textToJson(responseData);
        }

        setFilms(responseData);
      } catch (error) {
        console.error("Error searching for film:", error);
        setFilms([]);
      }
    } else {
      fetchFilms(acceptHeader);
    }
  };

  useEffect(() => {
    searchFilms(searchStr);
    console.log(import.meta.env.VITE_API_URL);
  }, [searchStr]);

  useEffect(() => {
    const mount = async () => {
      await fetchFilms(acceptHeader);
    };

    // Disable text selection for elements with class "no-select"
    const noSelectElements = document.querySelectorAll(".no-select");
    noSelectElements.forEach((element) => {
      element.style.webkitUserSelect = "none";
      element.style.mozUserSelect = "none";
      element.style.msUserSelect = "none";
      element.style.userSelect = "none";
    });
    mount();
  }, [acceptHeader]);

  return (
    <main className="no-select">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Index searchStr={searchStr} setSearchStr={setSearchStr} />}
        />
        <Route path="/:title" element={<FilmDetails />} />
      </Routes>

      <div
        className={`fixed top-0 left-0 right-0 h-[100vh] ${
          chosenFilm.id !== "" ? "visible" : "invisible"
        } flex flex-col gap-8 items-center justify-center bg-black/50 backdrop-blur-md z-40`}
      >
        <p className="text-center sm:px-0 px-3">
          Are you sure you want to delete {chosenFilm.title}?
        </p>
        <div className="flex items-center justify-center gap-3">
          <p
            className="cursor-pointer p-2 rounded-md border hover:bg-[#ffffffec] hover:text-black"
            onClick={cancelDeleteClick}
          >
            Cancel
          </p>
          <p
            className="cursor-pointer bg-[#d20000e2] hover:bg-[#d20000] hover:text-black p-2 rounded-md"
            onClick={deleteFilm}
          >
            Delete
          </p>
        </div>
      </div>

      <div
        className={`fixed top-[20%] sm:inset-x-[35%] inset-x-[20%] sm:text-sm text-[0.65rem] border shadow-lg backdrop-blur-2xl rounded-lg px-4 py-3 z-50 flex flex-row items-start justify-between gap-4 ${
          isOpen ? "visible" : "invisible"
        }`}
        style={{
          backgroundColor: bgColour,
          color: textColour,
          borderColor: bgColour,
        }}
      >
        {message}{" "}
        <span className="text-xl cursor-pointer" onClick={closeFeedbackPopup}>
          <IoClose />
        </span>
      </div>
    </main>
  );
}

export default App;
