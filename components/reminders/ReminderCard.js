import Image from "next/image";
import React, { useState } from "react";
import Moment from "react-moment";
import { useMutation } from "react-query";
import { deleteReminder } from "../../pages/api/reminderApi";
import { queryClient } from "../../pages/_app";
import { stampToDate } from "../../utils/dateConverter";
import EditReminderModal from "../modals/EditReminderModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Signin.module.css";

export default function ReminderCard({ reminder, reminders }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditReminderModal, setShowEditReminderModal] = useState("hidden");


  const showMore = () => {
    setIsOpen(!isOpen);
  };

  const { isLoading, isError, mutate } = useMutation(
    () => deleteReminder(reminder.xID),
    {
      onSuccess: (context) => {
        queryClient.invalidateQueries(["reminders"]);
      },
        onError: (error, query) => {
          if (query.state.data !== undefined) {
            toast.error(`Something went wrong: ${error.message}`);
          }
        },
    
    }
  );

 

if (isError) {
  return (
    <div className=" text-black flex justify-center text-xl items-center font-bold mt-[200px]">
      <p>Oops!! Something went wrong</p>
    </div>
  );
}


  return (
    <>
      <div className="w-full">
        <div className="block p-6 rounded-lg w-full bg-white">
          <div className="relative mb-6">
            <div className="absolute left-0">
              <div className="flex">
                {" "}
                <Image
                  src="/icons/ReminderTag.svg"
                  alt="Wakanda"
                  width={80}
                  height={20}
                />
              </div>
            </div>
            <div className="absolute right-0 cursor-pointer" onClick={showMore}>
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
              <div className="absolute right-5 grid grid-cols-1 py-1 divide-[#EFF7F0]  divide-y bg-white rounded-sm ">
                <p
                  className="text-[12px] text-gray-400 px-2 py-1 cursor-pointer"
                  onClick={() => {
                    setShowEditReminderModal("block");
                    setIsOpen(false);
                  }}
                >
                  Edit Reminder
                </p>
                <p
                  className="text-[12px] text-gray-400 px-2 py-1 cursor-pointer"
                  onClick={() => {
                    mutate();
                    setIsOpen(false);
                  }}
                >
                  Delete Reminder
                </p>
              </div>
            )}
          </div>

          <p className="text-[#163828] pt-4  border-[#87AC9B] text-sm font-bold mb-4 mt-2">
            {reminder.title}
          </p>
          <p className="font-medium text-[#163828] border-b-[1px] pb-3 border-[#87AC9B] text-xs mb-4 mt-2 leading-5">
            {reminder.description}
          </p>

          <div className="flex space-x-4 justify-between">
            <div>
              <p className="text-xs text-[#648B7A] font-bold">
                Associated with:
              </p>
              <p className="text-xs text-[#163828] font-medium ">
                Babatunde Adenrele
              </p>
            </div>
            <div>
              <p className="text-xs text-[#648B7A] font-bold">Reminder due:</p>
              <p className="text-xs text-[#163828] font-medium">
                <Moment fromNow>{stampToDate(reminder?.timeCreated)}</Moment>
              </p>
            </div>
          </div>
        </div>
      </div>
      <EditReminderModal
        display={showEditReminderModal}
        reminder={reminder}
        // reloadReminders={reloadReminders}
        close={() => {
          setShowEditReminderModal("hidden");
        }}
      />
    </>
  );
}
