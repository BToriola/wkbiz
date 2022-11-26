import React from "react";

const HeaderMenuReminder = () => {
  return (
    <div className=" border-b-[1px] sm:w-full mb-4 border-[#87AC9B]">
      <div className="md:flex">
        <div className="md:flex flex-1 w-64 space-x-3">
          <button className="px-4  dark:focus:text-[#00A85A]  text-sm text-[#87AC9B] border-b-4  border-solid border-transparent dark:focus:border-[#00A85A] hover:border-current cursor-pointer select-none">
            Reminders
          </button>
          <button className="px-2  dark:focus:border-b-4 dark:focus:text-[#00A85A] dark:focus:border-[#00A85A]  text-sm text-[#87AC9B] border-b-4 rounded-t-2xl border-solid border-transparent hover:border-current cursor-pointer select-none]">
            Archived
          </button>
        </div>

        <div className="flex justify-end ">
          <button className="p-2 flex text-sm">
            Filter:{" "}
            <select
              className="  text-xs  text-gray-700 mt-[2px] bg-transparent  bg-no-repeat rounded transition ease-in-out focus:text-gray-700 font-bold focus:outline-none"
              aria-label="Default select example"
            >
              <option selected>Relevant</option>
              <option value="read">Read</option>
              <option value="new">New</option>
              <option value="due">Due</option>
              <option value="done">Done</option>
            </select>
          </button>

          <button className=" text-sm">
            Sort by:{" "}
            <select
              className="form-select   text-xs  text-gray-700 bg-transparent bg-clip-padding bg-no-repeat roundedtransition ease-in-out  focus:text-gray-700 font-bold focus:outline-none"
              aria-label="Default select example"
            >
              <option selected>Recent</option>
              <option value="read">Oldest </option>
            </select>
            {/* <Image src="/caret-down.png" alt="Wakanda" width={25} height={10} /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMenuReminder;
