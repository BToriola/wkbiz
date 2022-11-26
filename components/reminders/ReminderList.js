import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReminderCard from "../reminders/ReminderCard";
import ReminderModal from "../modals/ReminderModal";
import { AddReminderIcon, Avatar, ReminderButton } from "../icons";
import { Oval } from "react-loading-icons";
import { getAllReminders } from "../../pages/api/reminderApi";
import { useQuery } from "react-query";

export default function ReminderList() {
  const [showReminderModal, setShowReminderModal] = useState("hidden");
  const [REMINDERS, setREMINDERS] = useState([]);
  const { data, isError, isLoading } = useQuery(["reminders"], getAllReminders);

  useEffect(() => {
    if (data) {
      setREMINDERS(data.data);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="text-[#87AC9B] flex justify-center items-end mt-[200px]">
        <Oval stroke="#00A85A" strokeWidth={4} height="2em" />
      </div>
    );

  if (isError) {
    return (
      <div className=" text-black flex justify-center text-xl items-center font-bold mt-[200px]">
        <p>Oops!! Something went wrong</p>
      </div>
    );
  }

  if (data?.data?.length === 0)
    return (
      <div className=" flex flex-col   justify-center overflow-scroll ">
        <div className=" mx-auto py-8 ">
          <Avatar />
        </div>

        <div>
          <p className="w-2/5 text-sm  mx-auto text-center text-[#648B7A] ">
          You Have Not Create Any Reminder Click The “New Reminder” Button Below To Create New Reminder
          </p>
        </div>

        <div>
          <div className="text-center">
            <AddReminderIcon
              className="inline" 
              onClick={() => setShowReminderModal("block")}
            />
          </div>
        </div>
        <ReminderModal
        display={showReminderModal}
        close={() => {
          setShowReminderModal("hidden");
        }}
      />
      </div>
    );


  return (
    <React.Fragment>
      <p className="text-[#87AC9B] py-2">Upcoming</p>
      <div className="overflow-auto h-full pb-28">
        <div className="grid md:grid-cols-2 lg:w-full sm:w-96 gap-5">
          {REMINDERS &&
            REMINDERS.map((reminder, id) => {
              return (
                <ReminderCard
                  reminder={reminder}
                  reminders={REMINDERS}
                />
              );
            })}
        </div>
        <div
          className="fixed right-3 md:right-28 bottom-6 md:bottom-14 cursor-pointer"
          onClick={() => setShowReminderModal("block")}
        >
          <Image
            src="/icons/remindIcon.svg"
            alt="Wakanda"
            width={80}
            height={80}
            onClick={() => setShowReminderModal("block")}
          />
        </div>
      </div>

      <ReminderModal
        display={showReminderModal}
        close={() => {
          setShowReminderModal("hidden");
        }}
      />
    </React.Fragment>
  );
}
