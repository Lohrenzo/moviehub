import { create } from "zustand";

import { xmlToJson, textToJson } from "../utils/formatter";

// Axios
import axios from "../apiRequest/axios";

// URLs
// const Films_URL = "films";

// Store for managing update film popup state
export const useUpdatePopUpStore = create((set) => ({
  updatePopUp: false,
  openUpdatePopup: () => set({ updatePopUp: true }),
  closeUpdatePopup: () => set({ updatePopUp: false }),
}));

// Store for films state
export const useFilmsStore = create((set) => ({
  films: [],
  setFilms: (films) => set({ films }),
  acceptHeader: "application/json",
  setAcceptHeader: (acceptHeader) => set({ acceptHeader }),
  fetchFilms: async (acceptHeader) => {
    set({ films: [] });
    try {
      const response = await axios.get("/", {
        headers: { Accept: acceptHeader },
      });

      let responseData = response?.data || [];

      if (acceptHeader === "application/xml") {
        responseData = xmlToJson(responseData);
      }

      if (acceptHeader === "text/plain") {
        responseData = textToJson(responseData);
      }

      set({ films: responseData });
    } catch (error) {
      console.error("Error fetching films:", error);
      set({ films: [] });
    }
  },
  chosenFilm: { id: "", title: "" },
  setChosenFilm: (chosenFilm) => set({ chosenFilm }),
  deleteButtonClick: (filmId, filmTitle) => {
    set({ chosenFilm: { id: filmId, title: filmTitle } });
  },
  cancelDeleteClick: () => {
    set({ chosenFilm: { id: "", title: "" } });
  },
}));

// Store for managing feedback popup state
export const useFeedbackStore = create((set) => ({
  isOpen: false,
  message: "Feedback default message!",
  bgColour: "#121d3457", // Default background colour
  textColour: "#000000", // Default text colour
  openFeedbackPopup: (message, bgColour, textColour) => {
    set({ isOpen: true, message, bgColour, textColour });
    // Set timer to automatically close the popup after 8 seconds
    setTimeout(() => {
      set({ isOpen: false });
    }, 12000);
  },
  closeFeedbackPopup: () => set({ isOpen: false }),
}));
