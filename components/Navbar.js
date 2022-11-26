/*  ./components/Navbar.jsx     */

import { useState, useEffect, useContext } from "react";

import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { FBauth } from "../configs/firebase-config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  // const { state, dispatch } = useContext(Context);
  const [user, setUser] = useState();
  //const [text, setText]= useState(state?.search_term || "")

  const handleClick = () => {
    setActive(!active);
  };

 
  return (
    <>
      <nav className="relative flex flex-wrap items-center shadow-xl justify-around px-2 py-1 mb-3 mx-auto ">
        <div className="container px-4 mx-auto flex  items-center justify-around max-w-screen-2xl lg:px-12 lg:pr-6">
          <div className="w-full md:w-96 ml-12 relative flex lg:w-auto lg:static lg:block lg:justify-around">
            <Image
              alt="logo"
              width="50"
              height="40"
              className="object-contain h-12 w-12"
              src={require("../assets/W2021.ab423404.png")}
            />
          </div>
          <div>
            <h2 className="text-[#00A85A]  tracking-wide font-sans font-bold">
              Wakanda&nbsp;<span className="font-normal font-sans">CRM</span>
            </h2>
          </div>
          <div className=" ml-8 ">
            <Image
              alt="logo"
              width="50"
              height="40"
              className="object-contain h-12"
              src={require("../assets/CompanyProfile.svg")}
            />
          </div>

          <h2 className="text-[#163828]  tracking-wide font-sans font-bold">
            Google&nbsp;Team
          </h2>

          <div className="lg:flex flex-grow justify-center items-center px-4 sm:px-6 lg:px-2 flex-row">
            <div className="relative">
              {" "}
              <input
                type="text"
                className="h-10 lg:w-60 md:w-60 pr-8 rounded z-0 focus:shadow focus:outline-none pl-10 text-xs"
                placeholder="Search anything..."
                // value={state?.search_term || ""}
                // onChange={(e) => {
                //   dispatch({
                //     type: "SEARCH",
                //     payload: e.target.value,
                //   });
                // }}
              />
              <div className="absolute top-2 left-3">
                {/* <FontAwesomeIcon
                  icon={faSearch}
                  style={{ fontSize: 15, color: "#87AC9B" }}
                /> */}
              </div>
            </div>
          </div>
          {/* <NavItem3 navbarOpen={navbarOpen} user={user} /> */}
          <button
            className="text-black cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            // onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <FontAwesomeIcon
              icon={faBars}
              style={{ fontSize: 20, color: "#87AC9B" }}
            />
          </button>
        </div>
      </nav>
    </>
  );
};

