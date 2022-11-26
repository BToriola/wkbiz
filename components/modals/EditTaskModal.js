import React, { useState, useEffect, useContext, useRef } from "react";


import { editTask } from "../../pages/api/taskApi";
import { doc, getDoc } from "firebase/firestore";
import { FBdb } from "../../configs/firebase-config";
import Input from "../form/Input";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import styles from "../../styles/Inbox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { queryClient } from "../../pages/_app";

function EditTaskModal({ display, close, task }) {
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(display);
  const [assignee, setAssignee] = useState(false);
  const [assigneeName, setAssigneeName] = useState("Assigned To");
  const [DETAILS, setDETAILS] = useState([]);
  const [assigneeProfileID, setAssigneeProfileID] = useState("");
  const [_customer, _setCustomer] = useState();


  const [taskData, setTaskData] = useState({
    title: task.title,
  });

  const showAssignees = () => {
    setAssignee(!assignee);
  };

  let DueDate = startDate._d?.getTime();
  const getAllProfiles = async () => {
    let ProfileIDs = [];
    const oID = localStorage.getItem('organizationIDs')
    let parsedOID = JSON.parse(oID)
    const organizationID = parsedOID[0]
    const docRef = doc(FBdb, "Organizations", organizationID);
    const docSnap = await getDoc(docRef);
    ProfileIDs.push(docSnap.data().memberProfileIDs);
    await loadProfiles(ProfileIDs);
  };

  const loadProfiles = async (c) => {
    try {
      const DETAILS = [];
      await Promise.all(
        c.map(async (pID) => {
          try {
            pID.map(async (oo) => {
              const pDocRef = doc(FBdb, "Profiles", oo);
              const docSnap = await getDoc(pDocRef);
              const p = docSnap.data();

              DETAILS.push(p);
              setDETAILS(DETAILS);
            });
          } catch (e) {
            console.warn(e, "ERR");
          }
        })
      );
    } catch (e) {
      global.warn(e, "lM99");
    }
  };

  useEffect(() => {
    getAllProfiles();
  }, []);
  
  const { isLoading, mutate, data } = useMutation(() => editTask({ title:taskData.title, taskID:task.xID, DueDate }), {
    onSuccess: (context) => {
      queryClient.invalidateQueries(["tasks"]);
      setShow("hidden");
      close();
      window.location.reload(false);
    },
    onError: (error) => {
    },
  });

  useEffect(() => {
    setShow(display);
  }, [display]);

  return (
    <div
      className={`fixed ${show} z-10 inset-0 bg-gray-900 bg-opacity-80 overflow-y-auto h-full w-full  `}
      id="my-modal"
    >
      <div className="relative  mx-auto mt-4  p-5 border pb-12 lg:w-2/5 md:sm:w-3/5 xs:w-3/4 shadow-lg rounded-lg bg-white">
        <div
          className={`text-left overflow-y-scroll ${styles["add-customer-form"]} pb-8`}
        >
          <div className={`${styles.header} w-full p-4 px-2 mb-2 font-bold`}>
            Edit task
          </div>

          <Input
            title={"Task Name"}
            value={taskData.title}
            placeholder={"What is the name of your task"}
            required
            onChange={(e) => {
              setTaskData((prev) => {
                return { ...prev, title: e };
              });
            }}
          />

          <label className="text-left pl-2 text-sm font-thin">
            Assigned to
            <span className="text-red-500 font-bold">{" *"}</span>
          </label>
          <div onClick={showAssignees} className="bg-[#EFF7F0] rounded-lg p-3 my-2 text-gray-400 text-sm border-2 border-[#00A85A]">
            {assigneeName}
          </div>
          {assignee && (
            <ul className="list-none py-2 bg-[#EFF7F0] rounded-lg p-3 my-2 text-gray-400 text-sm border-1 border-[#00A85A]">
              {DETAILS &&
                DETAILS.map((detail) => {
                  return (
                    <div>
                      <li
                        onClick={() => {
                          setAssigneeProfileID(detail.uid);
                          setAssigneeName(detail.name);
                          showAssignees();
                        }}
                        className="border-b-[1px] cursor-pointer border-gray-200 py-1 hover:text-green-600"
                      >
                        <div className="flex items-center space-x-2">
                          <span>
                            <Image
                              className="object-cover rounded-lg "
                              src={detail?.pictureURL || "https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg"}
                              width={40}
                              height={40}
                            />
                          </span>
                          <span>{detail?.name}</span>
                        </div>
                      </li>
                    </div>
                  );
                })}
            </ul>
          )}

          <label className="text-left pl-2 text-sm font-thin">
            Task Due Date
            <span className="text-red-500 font-bold">{" *"}</span>
          </label>
          <div className="flex">

            <ReactDatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              showTimeSelect
              dateFormat="Pp"
              timeIntervals={15}
              className="bg-[#EFF7F0] rounded-lg p-3 my-2 text-gray-400 text-sm border-2 border-[#00A85A]"
            />
          </div>

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
       
          <div className="absolute items-center px-0 py-3 bottom-0  w-11/12 pl-1 self-center">
            <button
              id="ok-btn"
              className={`${styles["customer-button"]} flex flex-row justify-center px-4 py-2 mb-0 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 `}
              onClick={async () => {
                mutate()
              }}
            >
              {isLoading ? "Creating record..." : "Save Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;
