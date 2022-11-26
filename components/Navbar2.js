import React, { useState, useEffect } from "react";
import { Transition, Menu } from "@headlessui/react";
import Image from "next/image"; 
import { Cross, MenuComponent } from "./icons";
import { useSelector, useDispatch } from "react-redux";

import CreateEditProfile from "./modals/Create-Edit-Profile";
import Router from "next/router";
import { userState, logOutUser } from "../redux/slices/userSlices";
import { FBauth } from "../configs/firebase-config";

function Navbar2() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [showModal, setShowModal] = useState("hidden");

  const dispatch = useDispatch()
  const user = useSelector((state) => state?.user?.user)

  // let organization = user?.organizationName
  // let userName = user?.profileData?.name || ''
  let organization = localStorage.getItem('organizationName')
  let userName = localStorage.getItem('userName')
  let pictureURL = user?.profileData?.pictureURL || `https://firebasestorage.googleapis.com/v0/b/ebimarketplace-bb986.appspot.com/o/user.png?alt=media&token=0e266e4c-48fb-455e-8606-b5e511cd53c9`





  const LogOut = () => {
        dispatch(logOutUser());   
  };

  return (
    <div>
      <nav className="bg-[#EFF7F0] shadow-lg flex justify-center h-16 shadow-[#88AC9B26] md:px-4 mb-4">
        <div className="flex items-center">
          <div className=" flex  items-center w-84 ">
            <Image alt="logo" width={50} height={40} className="object-contain   grow-0" src={require("../assets/W2021.ab423404.png")} />
            <h2 className="text-[#00A85A]  tracking-wide font-sans font-bold">
              Wakanda&nbsp;
              <span className="font-normal font-sans ">CRM</span>
            </h2>
          </div>
          <div className="hidden md:block mr-8">
            <div className="ml-10 flex items-center space-x-4">
              <div className="flex justify-center  items-center gap-2">
                <Image alt="logo" width="30" height="40" className="" src={require("../assets/CompanyProfile.svg")} />
                <h2 className="text-[#163828]  tracking-wide font-sans font-bold">{organization}</h2>
              </div>

              <div>
                <div className="relative">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-[#87AC9B] dark:text-[#87AC9B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block p-4  w-full  text-gray-900 bg-gray-50   focus:ring-[#87AC9B] focus:border-[#87AC9B] dark:bg-white dark:placeholder-[#87AC9B] dark:text-[#87AC9B] dark:focus:ring-[#87AC9B] dark:focus:border-blue-500 h-10  md:w-60 pr-8 rounded z-0 focus:shadow focus:outline-none pl-10  text-xs"
                    placeholder="Search..."
                    required
                  />
                </div>
              </div>

              <Menu>
                <div
                  className="relative flex items-center justify-center pl-44 "
                  // onClick={toggleNavModal}
                >
                  <Menu.Button>
                    <div className="flex min-w-fit">
                      <a
                        // href="#"
                        className="text-[#163828] hover:text-[#163828]  py-2 rounded-md text-sm font-bold mx-5 text-ellipsis"
                      >
                        {userName}
                      </a>

                      {pictureURL ? (
                        <Image
                          alt="profile-picture"
                          width={40}
                          height={40}
                          className="object-cover rounded-lg "
                          src={pictureURL || "https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg"}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      )}
                    </div>
                    <Menu.Items
                      className={`absolute top-[-10px] right-0 flex flex-col  justify-center items-center mt-14 max-h-[400px] w-[56]  max-w-lg p-4  mx-auto bg-[#FFFFFF] rounded-xl shadow-[#18A75D26] shadow-lg  z-20`}
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={`${active && "text-green-600"} text-gray-500`}
                            onClick={() => {
                              setShowModal("display");
                            }}
                          >
                            Edit Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={` py-2 ${active && "text-green-600"} text-gray-500`}
                            // href="/account-settings"
                            onClick={() => LogOut()}
                          >
                            Sign Out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu.Button>

                  {/* <p className="border border-[#A9D046] text-[#A9D046] text-xs px-2 mx-2 rounded">
                      {role}
                    </p> */}
                </div>
              </Menu>
            </div>
          </div>
        </div>
        <div className="-mr-2 flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="bg-transparent inline-flex items-center justify-center p-2 rounded-md text-[#00A85A] focus:outline-none "
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? <MenuComponent /> : <Cross />}
          </button>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <div className="flex justify-center  items-center gap-2">
                  <Image alt="logo" width="30" height="40" className="" src={require("../assets/CompanyProfile.svg")} />
                  <h2 className="text-[#163828]  tracking-wide font-sans font-bold">Google&nbsp;Team</h2>
                </div>

                <div className="flex justify-center items-center">
                  {/* <input
                    type="text"
                    className="h-10  pr-8 rounded z-0 focus:shadow focus:outline-none pl-10  text-xs"
                    placeholder="Search"
                    // value={state?.search_term || ""}
                    // onChange={(e) => {
                    //   dispatch({
                    //     type: "SEARCH",
                    //     payload: e.target.value,
                    //   });
                    // }}
                  /> */}
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-[#87AC9B] dark:text-[#87AC9B]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block p-4  w-full  text-gray-900 bg-gray-50   focus:ring-[#87AC9B] focus:border-[#87AC9B] dark:bg-white dark:placeholder-[#87AC9B] dark:text-[#87AC9B] dark:focus:ring-[#87AC9B] dark:focus:border-blue-500 h-10  md:w-60 pr-8 rounded z-0 focus:shadow focus:outline-none pl-10  text-xs"
                      placeholder="Search..."
                      required
                    />
                  </div>
                </div>
                <Menu>
                  <Menu.Button>
                    <div
                      className=" flex  items-center justify-center "
                      // onClick={toggleNavModal}
                    >
                      <a
                        // href="#"
                        className="text-[#163828] hover:text-white pl-44 py-2 rounded-md text-sm font-bold"
                      >
                        {profileName || ""}
                      </a>

                      <Image alt="logo" width="50" height="45" className="" src={require("../assets/profilepic.png")} />
                    </div>
                  </Menu.Button>
                  <Menu.Items
                    className={` flex flex-col  justify-center items-center mt-14 max-h-[400px] w-[56]  max-w-lg p-4  mx-auto bg-[#FFFFFF] rounded-xl shadow-[#18A75D26] shadow-lg  z-20`}
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <a className={`${active && "bg-blue-500"}`} onClick={toggleModal}>
                          Edit Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a className={` py-2 ${active && "bg-blue-500"}`} onClick={LogOut}>
                          Sign Out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          )}
        </Transition>
        <>
          <CreateEditProfile
            display={showModal}
            close={() => {
              setShowModal("hidden");
            }}
            // close={() => setShowModal(false)}
          />
        </>
      </nav>
    </div>
  );
}

export default Navbar2;
