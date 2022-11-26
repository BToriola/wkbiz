import React, { useState, useEffect, useContext, useRef } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { FBdb } from '../../configs/firebase-config';

import { FBauth } from "../../configs/firebase-config";
import { getIdToken } from "firebase/auth";
import Moment from "react-moment";

import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import TimePicker from 'react-time-picker/dist/entry.nostyle'


import styles from "../../styles/Inbox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ArrowDown from "../icons/ArrowDown";
import { Repeat } from "../icons";
import { createReminder } from "../../pages/api/reminderApi";
import CustomerView from "../customers/CustomerView";
import { useMutation } from "react-query";
import { queryClient } from "../../pages/_app";

function ReminderModal({ display, close }) {
  const [startDate, setStartDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerID, setCustomerID] = useState('')
  const [show, setShow] = useState(display);
  const [assignee, setAssignee] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [repeatValue, setRepeatValue] = useState("No Repeat");
  const [notify, setNotify] = useState(false);
  const [dueDate, setDueDate] = useState(
    <Moment format="MMMM d, YYYY"></Moment>
  );
  const [_customer, _setCustomer] = useState();
  const [idToken, setIDtoken] = useState();
  const [showCustom, setShowCustom] = useState(false);
  const [showCustomerView, setShowCustomerView] = useState(false)
  const [value, onChange] = useState('10:00');
  const [customers, setCustomers] = useState([{
		pictureURL:"", name:"Rele", businessName :"Sleek Ops", type:"LEAD"
	},
	{
		pictureURL:"", name:"Rele", businessName :"Sleek Ops", type:"LEAD"
	},
	{
		pictureURL:"", name:"Rele", businessName :"Sleek Ops", type:"EVANGELIST"
	},
	{
		pictureURL:"", name:"Rele", businessName :"Sleek Ops", type:"CUSTOMER"
	},
	{
		pictureURL:"", name:"Rele", businessName :"Sleek Ops", type:"LEAD"
	}]);

  const [uid, setUID] = useState("");
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(false);

  // const [taskData, setTaskData] = useState({
  //   title: "",
  // });

  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  current.setDate(current.getDate() + 1);
  const tommorrow = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;


  const dueDateMillis = startDate.getTime();
  const { isLoading, mutate, data } = useMutation(() => createReminder({
    title,
    description,
    dueDateMillis,
    repeatValue,
    customerID
  }), {
    onSuccess: (context) => {
      queryClient.invalidateQueries(["reminders"])
      setShow("hidden")
  }
})

  const getAllCustomers = async () => {
		//if (state.members && state.members.length > 0) return;
		let CUSTOMERS = [];
		const docRef = collection(
			FBdb,
			'Organizations',
			'i0OAsUwlAPnbV5JvnDJX',
			'Customers'
		);
		const membersSnap = await getDocs(docRef);
		membersSnap.forEach((snap) => {
			const ir = snap.data();
			ir.xID = snap.id;
			CUSTOMERS.push(ir);
		});
		setCustomers(CUSTOMERS); 
	};

  useEffect(() => { 
		getAllCustomers();
	}, []);

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const showAssignees = () => {
    setAssignee(!assignee);
  };

  const showRepeat = () => {
    setRepeat(!repeat);
  };
  const showNotify = () => {
    setNotify(!notify);
  };

  const changeRepeatValue = (value) => {
    setRepeatValue(value);
    setRepeat(false);
  };


  useEffect(() => {
    setShow(display);
  }, [display]);

  return (
    <div
      className={`fixed ${show} z-10 inset-0 bg-gray-900 bg-opacity-80 overflow-y-auto h-full w-full  `}
      id="my-modal"
    >
      <div className="relative  mx-auto mt-4  p-5 border pb-12 lg:w-1/3 md:sm:w-3/5 xs:w-3/4 shadow-lg rounded-lg bg-white">
        <div
          className={`text-left overflow-y-scroll ${styles["add-customer-form"]} pb-8`}
        >
          <div className={` w-full  mb-8 text-base tracking-wide`}>
            CREATE REMINDER
          </div>

          <form className="w-full">
            <label className="text-xs font-bold" htmlFor="title">
              Title:
            </label>
            <div className="flex items-center border-b border-[#87AC9B] pt-2 mb-3">
              <input
                className="appearance-none bg-transparent border-none placeholder-[#87AC9B]  placeholder:text-xs w-full placeholder-text-xs text-gray-700 mr-3 pb-1   leading-tight focus:outline-none"
                type="text"
                placeholder="Type reminder title here"
                aria-label="Full name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <label className="text-xs font-bold " htmlFor="title">
              Description:
            </label>
            <div className="flex items-center border-b border-[#87AC9B] pb-4">
              <textarea
                id="description"
                rows="2"
                className="appearance-none bg-transparent border-none placeholder-[#87AC9B]  placeholder:text-xs text-xs w-full placeholder-text-xs text-gray-700 mr-3 py-1  leading-tight focus:outline-none"
                placeholder="Type your reminder description here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-xs font-bold mt-4 mb-2"
                for="username"
              >
                Due Day
              </label>
              <div
                onClick={showAssignees}
                className=" rounded-lg p-2 my-2 text-[#163828] text-xs border flex justify-between items-center  border-[#87AC9B]"
              >
                <span>
                  {" "}
                  <span className="font-bold">{dueDate}</span>
                </span>
                <ArrowDown width={20} />
              </div>
              {assignee && (
                <ul className="list-none py-2 bg-[#FFFFFF] shadow-lg shadow-[#18A75D66] rounded-lg p-3 my-2 text-gray-400 text-sm border-1 border-[#00A85A]">
                  <li
                    className=" border-gray-200 py-4 hover:cursor-pointer text-xs text-[#87AC9B] hover:text-green-600"
                    onClick={() => {setDueDate(`Today`);setStartDate(new Date(date));showAssignees()}}
                  >
                    <span className="font-bold">Today</span> {date}
                  </li>
                  <li
                    className=" border-gray-200 py-4 hover:cursor-pointer text-[#87AC9B] text-xs hover:text-green-600"
                    onClick={() => {setDueDate(`Tommorrow`);setStartDate(new Date(tommorrow));showAssignees()}}
                  >
                    <span className="font-bold">Tommorrow</span> {tommorrow}
                  </li>
                  {/* <li
                    className="hover:text-green-600 py-4 hover:cursor-pointer text-[#87AC9B] text-xs"
                    onClick={() => {setDueDate(`3 Business Days`);setStartDate(new Date(threeDays));;showAssignees()}}
                  >
                    {" "}
                    <span className="font-bold"> 3 Business Days</span>{" "}
                    {threeDays}
                  </li>
                  <li
                    className="hover:text-green-600 py-4 hover:cursor-pointer text-[#87AC9B] text-xs"
                    onClick={() => {setDueDate(`1 week`);setStartDate(new Date(oneWeek));showAssignees()}}
                  >
                    {" "}
                    <span className="font-bold"> 1 Week </span> {oneWeek}
                  </li> */}

                  <li className="hover:text-green-600 py-4 hover:cursor-pointer text-[#87AC9B] text-xs">
                    {" "}
                    <span
                      className="font-bold"
                      onClick={() => setShowCustom(true)}
                    >
                      {" "}
                      Custom
                    </span>
                    {showCustom == true && (
                      <ReactDatePicker
                        selected={startDate}
                        onChange={(date) => {setStartDate(date)}}
                        className="bg-[#EFF7F0] rounded-lg p-3 my-2 text-gray-400 text-sm border-2 border-[#00A85A]"
                      />
                    )}
                  </li>
                </ul>
              )}
            </div>
           
            <div className="flex justify-between space-x-2">
              <div className="mb-4 w-1/2">
                <label
                  className="block text-gray-700 text-xs font-bold mt-4 mb-2"
                  for="username"
                >
                  Due Time
                </label>
                <TimePicker onChange={onChange} value={value}  />
                
              </div>
             
            </div>
            <div className="mb-4">
              <label
                className=" text-gray-700 text-xs font-bold mt-4 mb-2"
                for="username"
              >
                <span className="flex space-x-2">
                  <Repeat width={10} />
                  &nbsp; Repeat
                </span>
              </label>
              <div
                onClick={showRepeat}
                className=" rounded-lg p-2 my-2 text-[#163828] text-xs border flex justify-between items-center  border-[#87AC9B]"
              >
                <span>
                  {" "}
                  <span className="">{repeatValue}</span>
                </span>
                <ArrowDown width={20} />
              </div>
              {repeat && (
                <ul className="list-none py-2 bg-[#FFFFFF] shadow-lg shadow-[#18A75D66] rounded-lg p-3 my-2 text-gray-400 text-sm border-1 border-[#00A85A]">
                  <li className=" border-gray-200 py-4 hover:cursor-pointer text-xs text-[#87AC9B] hover:text-green-600">
                    <span
                      className="font-bold"
                      onClick={() => changeRepeatValue("No repeat")}
                    >
                      No repeat
                    </span>
                  </li>
                  <li className=" border-gray-200 py-4 hover:cursor-pointer text-[#87AC9B] text-xs hover:text-green-600">
                    <span
                      className="font-bold"
                      onClick={() => changeRepeatValue("Daily")}
                    >
                      Daily
                    </span>
                  </li>
                  <li className="hover:text-green-600 py-4 hover:cursor-pointer text-[#87AC9B] text-xs">
                    {" "}
                    <span
                      className="font-bold"
                      onClick={() => changeRepeatValue("Weekly")}
                    >
                      Weekly
                    </span>
                  </li>
                  <li className="hover:text-green-600 py-4 hover:cursor-pointer text-[#87AC9B] text-xs">
                    {" "}
                    <span
                      className="font-bold"
                      onClick={() => changeRepeatValue("Monthly")}
                    >
                      Monthly
                    </span>
                  </li>
                  <li className="hover:text-green-600 py-4 hover:cursor-pointer text-[#87AC9B] text-xs">
                    {" "}
                    <span
                      className="font-bold"
                      onClick={() => changeRepeatValue("Yearly")}
                    >
                      Yearly
                    </span>
                  </li>
                </ul>
              )}
            </div>
          </form>

          <p className="text-xs font-bold text-[#163828] py-2">
            Associate with:
          </p>
          <p className="text-[#00A85A] cursor-pointer text-xs font-medium" onClick={() => setShowCustomerView(true)}>+ ADD CUSTOMER</p>
          {showCustomerView && <CustomerView Customers={customers} passSelectedCustomer = {(selected) => {setCustomerID(selected)}} />}

          <div
            className="absolute  top-8  w-6 p-2 py-0 bg-white opacity-50 hover:opacity-90 right-4 rounded-lg"
            onClick={() => {
              setShow("hidden");
              close();
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{
                fontSize: 20,
                color: "#87AC9B",
                alignSelf: "right",
              }}
            />
          </div>
          {activityIndicatorAnimating && (
            <div className="absolute bottom-0 w-full left-0 h-full bg-white self-center opacity-70"></div>
          )}
          <div className="absolute items-center px-0 py-3 bottom-0  w-11/12 pl-1 self-center">
            <button
              id="ok-btn"
              className={`${styles["customer-button"]} flex flex-row justify-center px-4 py-2 mb-0 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 `}
              onClick={async () => {
                mutate()
              }}
            >
              {activityIndicatorAnimating ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReminderModal;
