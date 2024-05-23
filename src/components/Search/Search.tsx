'use client';

import { useRouter } from "next/navigation";
import { ChangeEvent, FC } from "react";

type Props={
  roomTypeFilter:string;
  searchQuery:string;
  setRoomTypeFilter:(value:string)=>void;
  setSearchQuery:(value:string)=>void;
}

const Search:FC<Props> = ({
  roomTypeFilter,
  searchQuery,
  setRoomTypeFilter,
  setSearchQuery
}) => {
  const router=useRouter();

  const handleRoomTypeChange=(event: ChangeEvent<HTMLSelectElement>)=>{
    setRoomTypeFilter(event.target.value);
  };

  const handleSearchQueryChange=(event: ChangeEvent<HTMLInputElement>)=>{
    setSearchQuery(event.target.value);
  };

  const handleFilterClick=()=>{
    //Navigate to the rooms page with the query
    router.push(`/rooms?roomType=${roomTypeFilter}&searchQuery=${searchQuery}`);
  };
  return ( 
    <section className="bg-tertiary-light px-4 md:px-20 py-6 rounded-lg">
      <div className="container mx-auto flex flex-wrap gap-4 justify-between items-center">
        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black md:text-center">
            Room
          </label>
          <div className="relative md:w-1/6 w-full">
            <select
             value={roomTypeFilter}
             onChange={handleRoomTypeChange} 
             className="px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none ">
              <option value="All">All</option>
              <option value="Superior Room">Superior Room</option>
              <option value="Luxury Room">Luxury Room</option>
            </select>
          </div>
        </div>

        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black md:text-center">
            Suite
          </label>
          <div className="relative md:w-1/6 w-full">
            <select
             value={roomTypeFilter}
             onChange={handleRoomTypeChange} 
             className="px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none">
              <option value="All">All</option>
              <option value="Prestige Suite">Prestige Suite</option>
              <option value="Mogador Suite">Mogador Suite</option>
            </select>
          </div>
        </div>

        <div className="w-full md:1/3 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black md:text-center">
            Villa
          </label>
          <div className="relative md:w-1/6 w-full">
            <select
             value={roomTypeFilter}
             onChange={handleRoomTypeChange} 
             className="px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none">
              <option value="All">All</option>
              <option value="Prestige Villa">Prestige Villa</option>
              <option value="Mogador Villa">Mogador Villa</option>
              <option value="Lacoste Villa">Lacoste Villa</option>
            </select>
          </div>
        </div>

        <button className="btn-primary" type="button" onClick={handleFilterClick}
        >
          Search
        </button>

      </div>
    </section>
  );
}
 
export default Search;