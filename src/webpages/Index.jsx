import React, { useState, useEffect } from "react";

import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { IconContext } from "react-icons";

// Component
import Searchbar from "../components/Searchbar";
import FilmCard from "../components/FilmCard";

// Zustand
import { useFilmsStore } from "../store/store";

const Index = ({ searchStr, setSearchStr }) => {
  const { films } = useFilmsStore();
  const [page, setPage] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const numOfFilmsPerPage = 12;

  useEffect(() => {
    setFilterData(
      films.slice(page * numOfFilmsPerPage, (page + 1) * numOfFilmsPerPage)
    );
  }, [films, page]);

  return (
    <>
      <div className="sm:grid sm:grid-cols-2 flex flex-col-reverse mx-auto px-7 lg:w-[90%] md:w-[100%] sm:w-[90%]">
        <p className="text-left text-wrap sm:text-[1.8rem] text-[0.8rem] font-bold">
          Search Films: <span className="text-[1.5rem]">{searchStr}</span>
        </p>
        <Searchbar setSearchStr={setSearchStr} searchStr={searchStr} />
      </div>

      <div className="p-4 m-3">
        {filterData && filterData.length > 0 ? (
          <div className="bg-black/40 backdrop-blur-sm mx-auto shadow-lg shadow-[#262626a4] p-5 rounded-lg max-w-fit grid gap-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {filterData.map((f, index) => (
              <FilmCard
                key={index}
                id={f.id}
                title={f.title}
                year={f.year}
                director={f.director}
                stars={f.stars}
                review={f.review}
                added={f.added}
                lastModified={f.lastModified}
              />
            ))}
          </div>
        ) : (
          <div className="bg-black/40 backdrop-blur-sm mx-auto shadow-lg shadow-[#262626a4] p-5 rounded-lg capitalize w-full text-lg text-center flex flex-row items-center justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white/55 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-3 h-3 rounded-full bg-white/75 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-white/55 animate-bounce [animation-delay:.7s]"></div>
            {/* Films Loading... */}
          </div>
        )}

        {filterData.length > 0 && (
          <ReactPaginate
            containerClassName={"pagination"}
            activeClassName={"pagination-active"}
            pageClassName={"page-item"}
            onPageChange={(event) => setPage(event.selected)}
            breakLabel="..."
            pageCount={Math.ceil(films.length / numOfFilmsPerPage)}
            previousLabel={
              <IconContext.Provider
                value={{ color: "rgb(255 255 255 / 0.4)", size: "2rem" }}
              >
                <AiFillLeftCircle />
              </IconContext.Provider>
            }
            nextLabel={
              <IconContext.Provider
                value={{ color: "rgb(255 255 255 / 0.4)", size: "2rem" }}
              >
                <AiFillRightCircle />
              </IconContext.Provider>
            }
          />
        )}
      </div>
    </>
  );
};

export default Index;
