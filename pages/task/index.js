import React from "react";


import { useSelector } from "react-redux";
import Nav from "../../components/Navbar2";
import Main from "../../components/Main";
import { taskState } from "../../redux/slices/tasksSlices";

function DashboardIndex() { 
  return (
    <>
      <Nav />
      <Main />
    </>
  );
}

export default DashboardIndex;
