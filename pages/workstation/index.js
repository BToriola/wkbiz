import React, { useEffect, useState } from "react";
import Card from "../../components/tasks/Card";
// import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import SideMenu from "../../components/SideMenu";
import { getIdToken } from "firebase/auth";
import WorkstationCard from "../../components/workstation/WorkstationCard";
import Nav from "../../components/Navbar2";
import SideMenuMobile from "../../components/SideMenuMobile";
import Main from "../../components/Main";

function WorkstationIndex() {
  return (
    <>
      <Nav />
      <Main/>
    </>
  );
}

export default WorkstationIndex;
