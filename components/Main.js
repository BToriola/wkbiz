import Router from "next/router";
import { useState, useRef, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import CustomerList from "./customers/CustomerList";
import Inbox from "./messages/Inbox";
import initializeUserHook from "../hooks/initializeUserHook";
import getMenuSelection from "../hooks/getMenuSelection";
import SideMenu from "./SideMenu";
import SideMenuMobile from "./SideMenuMobile";
import Tasks from "./tasks";
import Workstation from "./workstation";
import Reminders from "./reminders";
import { AuthenticateUser } from "../utils/functions";

function Main() {
  const ref = useRef(null);
  const [menuSelection] = getMenuSelection();
  const [selectedUser, setSelectedUser] = useState();
  const [signedIn, setSignedIn] = useState(false);

  const getUser = async () => {
    const user = await AuthenticateUser();
    localStorage.setItem("userID", user.uid);
    if (user) {
      setSignedIn(true);
    }
  };

  useEffect(() => {
    getUser();
  }, [signedIn]);
  initializeUserHook();

  if (!signedIn) {
    return <></>;
  }
  return (
    <div className="relative grid lg:grid-cols-9 md:grid-cols-3 gap-6 font-body  md:px-24 xs:px-[20px] py-4 p-2 max-w-screen-xl mx-auto md:overflow-y-hidden md:h-[90vh]">
      <LoadingBar color="rgba(52, 211, 153)" ref={ref} height={5} shadow={true} />

      <>
        <div className="lg:col-span-2 md:col-span-1 rounded-lg h-full">
          {/* <Menu /> */}
          <div className="hidden md:block">
            <SideMenu menuSelect={menuSelection} />
          </div>
          <div className="sm:block md:hidden">
            <SideMenuMobile menuSelect={menuSelection} />
          </div>
        </div>
        <div className="grid lg:col-span-7 md:col-span-2 gap-6 overflow-hidden">
          {menuSelection === "/" && signedIn && (
            <>
              <Workstation />
            </>
          )}
          {menuSelection === "/workstation" && signedIn && <Workstation />}
          {menuSelection === "/task" && <Tasks />}
          {menuSelection === "/customers" && (
            <div className="relative grid h-full gap-6 overflow-hidden ">
              <div className="flex lg:md:flex-row  sm:xs:flex-column flex-wrap justify-around">
                <CustomerList
                  setUpdate={(val) => {
                    setSelectedUser(val);
                  }}
                  updateManagers={() => {
                  }}
                />
                <Inbox selectedUser={selectedUser} />
              </div>
              <div className="h-16"></div>
            </div>
          )}
          {menuSelection === "/reminders" && <Reminders />}
        </div>
      </>
    </div>
  );
}

export default Main;
