import React, { useEffect, useState } from "react";
import Card from "../../components/tasks/Card";
// import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import SideMenu from "../../components/SideMenu";
import { getIdToken } from "firebase/auth";
import WorkstationCard from "../../components/workstation/WorkstationCard";
import Nav from "../../components/Navbar2";
import SideMenuMobile from "../../components/SideMenuMobile";

function Workstation() {
  return (
    <>
      <div className="  lg:col-span-8 md:col-span-3 h-full gap-6 overflow-hidden ">
        <WorkstationCard />
      </div>
      <div className="h-16"></div>
    </>
  );
}

export default Workstation;
