import React from 'react'
import { FaMagnifyingGlass } from "react-icons/fa6";

const Searchbar = ({setSearchStr, searchStr}) => {

    const handleSearchChange = (e) => {
        setSearchStr(e.target.value);
    };
    return (
        <div className="w-full relative">
            <input 
                placeholder="Search" 
                onChange={handleSearchChange}
                value={searchStr}
                name="searchStr" 
                className="sm:p-2 p-1 border border-gray-700 active:border-[#0000a2] rounded-lg w-[100%]" type="text" 
            />
            <p className="absolute inset-y-1 end-0 sm:py-2 py-1 sm:px-4 px-2 rounded-e-lg cursor-none text-black/80 sm:*:hover:scale-125 *:hover:scale-[1.1] *:duration-125 *:transition-all"><FaMagnifyingGlass /></p>
        </div>
    )
}

export default Searchbar;