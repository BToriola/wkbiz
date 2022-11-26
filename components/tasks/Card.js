import Image from "next/image";
import React, { useState } from "react";
import Moment from "react-moment";
import { deleteTask, markRead, markedDone } from "../../pages/api/taskApi";
import styles from "../../styles/Signin.module.css";
import { stampToDate } from "../../utils/dateConverter";
import EditTaskModal from "../modals/EditTaskModal";
import { doc, getDoc } from "firebase/firestore";
import { FBdb } from "../../configs/firebase-config";
import { useEffect } from "react";
import { QueryCache, useMutation } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { queryClient } from "../../pages/_app";
import { AvatarAlt, AddReminderIcon } from "../icons"




export default function Card({ task, color, tasks }) {
  const [readState, setReadState] = useState("Accept");
  const [doneState, setDoneState] = useState(false);
  const [isDone, setIsDone] = useState("Undone");
  const [isOpen, setIsOpen] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState("hidden");
  const [assignerName, setAssignerName] = useState("");
  const [taskExists, setTaskExists] = useState(false);

  const { isLoading, isError, mutate, data, error } = useMutation(
    () => deleteTask(task.xID),
    {
      onSuccess: (context) => {
        queryClient.invalidateQueries(["tasks"]);
      },
      onError: (error, query) => {
        if (query.state.data !== undefined) {
          toast.error(`Something went wrong: ${error.message}`);
        }
      },
    }
  );

  const loadProfiles = async () => {
    try {
      const DETAILS = [];
      const pDocRef = doc(FBdb, "Profiles", task.assignerProfileID);
      const docSnap = await getDoc(pDocRef);
      const p = docSnap.data();
      DETAILS.push(p);
      const assignerName = p.name;
      setAssignerName(assignerName);
    } catch (e) {
    }
  };

  useEffect(async () => {
    await loadProfiles();
  }, []);

  const changeReadState = async () => {
    try {
      let taskID = task.xID;
      await markRead(taskID);
    } catch (err) {}
    setReadState("Accepted");
  };

  const changeMarkState = async () => {
    try {
      let doneState = true;
      let taskID = task.xID;
      setDoneState(true);
      setIsDone("Done");
      await markedDone(taskID, doneState);
    } catch (err) {}
    setDoneState(true);
  };

  const showMore = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (tasks?.includes(task)) {
      setTaskExists(true);
    }
  }, [tasks]);



if (isError) {
  return (
    <div className=" text-black flex justify-center text-xl items-center font-bold mt-[200px]">
      <p>Oops!! Something went wrong</p>
    </div>
  );
}

 
  return (
    <>
      <div className="lg:col-span-4 sm:col-span-1 md:col-span-2  w-full md:w-96  ">
        <div
          className={`block p-6 rounded-lg  bg-[${color}] bg-white`}
          style={{ backgroundColor: `${color}` }}
        >
          <div className="relative mb-6">
            <div className="absolute left-0">
              <div className="flex">
                {" "}
                <Image
                  src="/icons/TaskIdentifier.svg"
                  alt="Wakanda"
                  width={60}
                  height={20}
                />
                <p className="text-gray-900 text-xs flex justify-center items-center ml-2 leading-tight font-medium">
                  Status:{" "}
                  <span
                    className={`${
                      task.status == "NEW"
                        ? "bg-[#4DC5E2]"
                        : task.status == "READ"
                        ? "bg-[#935FF0]"
                        : "bg-[#e2b04d]"
                    } uppercase text-xs px-[5px] ml-1  rounded-sm text-white `}
                  >
                    {task.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="absolute right-0" onClick={showMore}>
              {" "}
              {isLoading && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className={`${styles["spinner"]}`}
                  style={{
                    fontSize: 30,
                    color: "#87AC9B",
                  }}
                />
              )}
              {!isLoading && (
                <Image
                  src="/icons/more.svg"
                  alt="Wakanda"
                  width={20}
                  height={20}
                />
              )}
            </div>
            {isOpen == true && (
              <div className="absolute top-[-40px] grid grid-cols-1 py-1 divide-[#648B7A]  divide-y right-[20px] bg-[#EFF7F0] rounded-lg ">
                <p
                  className="text-[12px] text-[#648B7A] font-semibold  px-2 py-1 cursor-pointer"
                  onClick={() => {
                    setShowEditTaskModal("block");
                    setIsOpen(false);
                  }}
                >
                  Edit Task
                </p>
                <p
                  className="text-[12px] text-[#648B7A] font-semibold  px-2 py-1 cursor-pointer"
                  onClick={() => {
                    mutate();
                    setIsOpen(false);
                  }}
                >
                  Delete Task
                </p>
              </div>
            )}
          </div>

          <p className="text-[#163828] py-4 border-b-[1px] border-[#87AC9B] text-[16px] font-bold mb-4 mt-2">
            {task.title}
          </p>
          <div className="flex space-x-4 justify-between">
            <p className="text-[#648B7A] text-xs">Assigned By:</p>
            <p className="text-[#648B7A] text-xs">Task Due:</p>
          </div>
          <div className="flex space-x-4 justify-between">
            <p className="text-xs text-[#163828]">{assignerName}</p>

            <p className="text-xs text-[#163828]">
              <Moment fromNow>{stampToDate(task?.timeDue)}</Moment>
            </p>
          </div>
          <div className="flex space-x-4 mt-3 justify-between ">
            <button
              type="button"
              className={`
                ${
                  readState === "Accepted" || task.markRead
                    ? "text-white uppercase  bg-[#00A85A] hover:bg-[#00A85A]  font-medium rounded-lg text-xs w-48 py-2  mb-2 focus:outline-none  "
                    : " text-[#00A85A] uppercase  bg-white focus:ring-1 focus:ring-[#00A85A] ring-1 ring-[#00A85A]  font-medium rounded-lg text-xs w-48 py-2  mb-2 "
                } `}
              onClick={() => changeReadState()}
            >
              {" "}
              {readState === "Accepted" || task.markRead ? (
                <Image
                  src="/icons/MarkedRead.svg"
                  alt="Wakanda"
                  width={25}
                  height={10}
                />
              ) : (
                ""
              )}
              {readState == "Accept" && !task.markRead ? "Accept" : "Accepted"}
            </button>

            <button
              className={`
                ${
                  isDone === "Undone"
                    ? " text-[#00A85A] uppercase outline outline-1 focus:ring-1 focus:ring-[#00A85A]  outline-offset-2    font-medium rounded-lg text-sm w-48 py-2 mb-2 focus:outline-none "
                    : " text-white uppercase bg-[#00A85A] focus:bg-[#00A85A]   font-medium rounded-lg text-xs w-48 py-2  mb-2 focus:outline-none "
                } `}
              onClick={() => {
                changeMarkState();
              }}
            >
              {doneState == true ? (
                <Image
                  src="/icons/checkmark-round.svg"
                  alt="Wakanda"
                  width={25}
                  height={10}
                />
              ) : (
                ""
              )}
              {isDone === "Done" ? "Done" : "UnDone"}
            </button>
          </div>
        </div>
      </div>
      <EditTaskModal
        display={showEditTaskModal}
        task={task}
        close={() => {
          setShowEditTaskModal("hidden");
        }}
      />
    </>
  );
}
