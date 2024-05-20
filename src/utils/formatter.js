export function xmlToJsonArray(xmlData) {
  const xmlDocoment = new DOMParser().parseFromString(
    xmlData,
    "application/xml"
  );
  const films = xmlDocoment.querySelectorAll("film");
  const filmsArray = [];

  for (const film of films) {
    const id = film.querySelector("id").textContent;
    const title = film.querySelector("title").textContent;
    const year = film.querySelector("year").textContent;
    const stars = film.querySelector("stars").textContent;
    const director = film.querySelector("director").textContent;
    const review = film.querySelector("review").textContent;
    const lastModified = film.querySelector("lastModified").textContent;
    const added = film.querySelector("added").textContent;

    const filmJson = {
      id: id,
      title: title,
      year: year,
      stars: stars,
      director: director,
      review: review,
      lastModified: lastModified,
      added: added,
    };

    filmsArray.push(filmJson);
  }

  console.log("XML TO JSON: ", filmsArray);
  return filmsArray;
}

export function xmlToJsonObject(xmlData) {
  const xmlDocoment = new DOMParser().parseFromString(
    xmlData,
    "application/xml"
  );
  const film = xmlDocoment.querySelector("film");

  const id = film.querySelector("id").textContent;
  const title = film.querySelector("title").textContent;
  const year = film.querySelector("year").textContent;
  const stars = film.querySelector("stars").textContent;
  const director = film.querySelector("director").textContent;
  const review = film.querySelector("review").textContent;
  const lastModified = film.querySelector("lastModified").textContent;
  const added = film.querySelector("added").textContent;

  const filmJson = {
    id: id,
    title: title,
    year: year,
    stars: stars,
    director: director,
    review: review,
    lastModified: lastModified,
    added: added,
  };

  console.log("XML TO JSON OBJECT: ", filmJson);
  return filmJson;
}

export function textToJsonArray(textData) {
  const filmsArray = [];

  // Split the text response by '#' to get an array of film strings
  const filmStrings = textData.split("#");

  // Parse each film string individually
  for (const filmString of filmStrings) {
    // Skip empty film strings
    if (filmString.trim() === "") {
      continue;
    }

    // Split each film string by '*' character to get film properties
    const filmProperties = filmString.split("**");

    // Initialize film object
    const film = {};

    // Extract film properties
    for (const property of filmProperties) {
      if (property.trim() === "") {
        continue;
      }

      const [key, value] = property.split("=");

      film[key.trim()] = value.trim();
    }

    // Convert 'year', 'id' properties to numbers
    film["year"] = parseInt(film["year"]);
    film["id"] = parseInt(film["id"]);

    // Create Date objects
    film["added"] = new Date(film["added"]).toLocaleString();
    film["lastModified"] = new Date(film["lastModified"]).toLocaleString();

    // Push film object into filmsArray
    filmsArray.push(film);
  }

  console.log("Text TO JSON: ", filmsArray);
  return filmsArray;
}

export function textToJsonObject(text) {
  const lines = text.split("**\n");
  const obj = {};

  lines.forEach((line) => {
    const [key, value] = line.split("= ");
    if (key && value) {
      obj[key.trim()] = value.trim();
    }
  });

  console.log("Text TO JSON OBJECT: ", obj);
  return obj;
}

export function humanizeDate(dateString, format) {
  let date;
  if (format === "application/xml") {
    // "YYYY-MM-DD HH:mm:ss" format
    date = new Date(dateString);
  } else if (format === "application/json") {
    // Convert "MMM DD, YYYY, hh:mm:ssa" ("Mar 18, 2024, 10:46:03?PM") format to "YYYY-MM-DD HH:mm:ss"
    // const [month, day, year, time] = dateString.split(/[,:\s?]/)
    const [month_day, year, time] = dateString.split(",");
    const [month, day] = month_day.split(" ");
    const [hour_ish, minute, second_ish] = time.split(":");
    const [second, ends_With] = second_ish.split("?");
    const HourClock = (param) => {
      if (param == "PM") {
        return 12;
      } else {
        0;
      }
    };
    const hour = parseInt(hour_ish) + HourClock(ends_With);
    console.log(ends_With);
    date = new Date(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
  } else if (format === "text/plain") {
    // "YYYY-MM-DD HH:mm:ss.S" format. Remove milliseconds for simplicity
    const parts = dateString.split(".");
    date = new Date(parts[0]);
  } else {
    return "Invalid date format";
  }

  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  console.log("date to humanize: " + date);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}
