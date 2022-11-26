import React, { useMemo, useState } from "react";
import CList from "./CardList";
import HeaderMenu from "../headerMenu";
import { useSelector } from "react-redux";
import { taskState } from "../../redux/slices/tasksSlices";
import CardList from "./CardList";


function Tasks() {
  const [menu, setMenu] = useState("My Tasks");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const allTasks = useSelector(taskState);
  const [tasks] = useState("");

  return (
    <>
      <div className=" md:col-span-8 sm:col-span-10 h-full gap-6 overflow-hidden ">
        <HeaderMenu
          onClik={(title) => setMenu(title)}
          onClickFilter={(value) => {
            setFilterBy(value);
          }}
          onClickSort={(text) => {
            setSortBy(text);
          }}
        />
        <div className="overflow-auto h-full pb-28">
        <CardList menu={menu}  />
        </div>
      </div>
    </>
  );
}

export default Tasks;
