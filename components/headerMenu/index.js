import Image from "next/image";
import React from "react";

const HeaderMenu = ({ onClik, onClickFilter, onClickSort }) => {
  const handleChange = (param) => {
    onClickFilter(param);
  };
  const handleSort = (param) => {
    onClickSort(param);
  };

  return (
    <div className=" border-b-[1px]  w-full mb-0 border-[#87AC9B]">
      <div className="md:flex">
        <div className="md:flex flex-1 w-64">
          <button
            className="px-4   dark:focus:text-[#00A85A]  text-sm text-[#87AC9B] border-b-4  border-solid border-transparent dark:focus:border-[#00A85A] hover:border-current cursor-pointer select-none"
            onClick={() => onClik("My Tasks")}
          >
            My Tasks
          </button>
          <button
            className="px-2   dark:focus:border-b-4 dark:focus:text-[#00A85A] dark:focus:border-[#00A85A]  text-sm text-[#87AC9B] border-b-4 rounded-t-2xl border-solid border-transparent hover:border-current cursor-pointer select-none]"
            onClick={() => onClik("Assigned By Me")}
          >
            Assigned By Me
          </button>
        </div>

        <div className="flex justify-end ">
          <button className="p-2 flex text-sm">
            Filter:{" "}
            <select
              onChange={(e) => handleChange(e.target.value)}
              className="  text-xs  text-gray-700 mt-[2px] bg-transparent  bg-no-repeat rounded transition ease-in-out focus:text-gray-700 font-bold focus:outline-none"
              aria-label="Default select example"
            >
              <option selected>Relevant</option>
              <option value="READ">Read</option>
              <option value="NEW">New</option>
              <option value="DUE">Due</option>
              <option value="ACCEPTED">Done</option>
            </select>
          </button>

          <button className=" text-sm">
            Sort by:{" "}
            <select
              onChange={(e) => handleSort(e.target.value)}
              className="form-select   text-xs  text-gray-700 bg-transparent bg-clip-padding bg-no-repeat roundedtransition ease-in-out  focus:text-gray-700 font-bold focus:outline-none"
              aria-label="Default select example"
            >
              <option selected>Recent</option>
              <option value="OLDEST">Oldest </option>
            </select>
            {/* <Image src="/caret-down.png" alt="Wakanda" width={25} height={10} /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
