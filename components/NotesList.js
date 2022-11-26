import React, { useState, useEffect, useContext, useRef } from "react";
//import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import useWindowDimensions from "../hooks/useWindowDimensions";
import Moment from "react-moment";
import InputEmoji from "react-input-emoji";
import Image from "next/image";
import styles from "../styles/Inbox.module.css";
import { FBdb, FBauth } from "../configs/firebase-config";
import { onSnapshot, doc } from "firebase/firestore";
import Card from "../components/tasks/Card";
import ReminderJSON from "../utils/reminders.json";
import ReminderCard from "../components/reminders/ReminderCard";
import { postNote } from "../utils/customer_funcs";
import { stampToDate } from "../utils/timehelper";

function NotesList({ customer }) {
  const [_customer, _setCustomer] = useState();
  const [_communityID, setCommunityID] = useState();
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState(customer?.notes || []);
  const [text, setText] = useState();
  const [task, setTask] = useState({});
  const [color, setColor] = useState("#FFFFFF");
  const { height, width } = useWindowDimensions();
  const [recordID, setRecordID] = useState();
  const messagesEndRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const tabs = ["Notes", "Activities", "About"];
  const [contactPerson, setContactPerson] = useState();
  const [activeTab, setActiveTab] = useState("Notes");

  const handleKeyPress = async (text) => {
    if (text?.trim() && text?.trim()?.length > 0) {
      setSending(true);
      let res = await postNote(text, customer.xID);
      if (res.msg == "SUCCESS") {
        scrollToBottom();
        setSending(false);
        setErrorMsg("");
        setText("");
      } else {
        setSending(false);
        setErrorMsg("Something went wrong... try later");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo(
      0,
      messagesEndRef.current.scrollHeight,
      "smooth"
    );
  };

  useEffect(() => {
    if (!recordID) return;
    const unsub = onSnapshot(
      doc(
        FBdb,
        "Organizations",
        "i0OAsUwlAPnbV5JvnDJX",
        "Customers",
        "7UrZvRT6XfqX4AEShAlM"
      ),
      (doc) => {
        
        scrollToBottom();
        // setNotes(doc.data()?.notes);
      }
    );
    return () => unsub();
  }, [recordID]);

  useEffect(() => {
    setNotes(customer?.notes);
    setRecordID(customer?.xID);
    if (customer?.representativeProfileID) {
      const unsub = onSnapshot(
        doc(FBdb, "Profiles", customer?.representativeProfileID),
        (_profile) => {
          const profile = _profile.data();
          if (profile) {
            setContactPerson(profile)
          } else {
            setContactPerson(null)
          }
        }
      );
    }
    return () => {
      // unsub();
      setNotes([]);
      setRecordID();
    }
  }, [customer]);

  return (
    <div className="  px-2 pr-0 lg:col-span-3 md:col-span-2 rounded-lg relative w-96 ">
      <div
        className={`${styles["notes-header-title"]} w-full p-4 px-0 font-bold text-xs py-2 m-0 pb-0`}
      >
        {tabs.map((tab) => {
          return (
            <button
              className={`px-4 ${activeTab == tab ? 'text-[#00A85A] border-[#00A85A]' : 'text-[#87AC9B] border-transparent'}  text-sm  border-b-4  border-solid hover:border-current cursor-pointer select-none pb-2`}
              onClick={() => setActiveTab(tab)}
              key={tab}
            >
              {tab}
            </button>
          )
        })}
      </div>
      <div
        className={` ${styles["notes-wrapper"]} overflow-y-scroll mt-0 pt-2 h-96 ${styles["scrollbar-hide"]} `}
        style={{
          height: height * 0.9 - 260 - 124,
        }}
        ref={messagesEndRef}
      >
        {{
          'Activities': <>
            <ReminderCard reminder={ReminderJSON[0]} />
            <div className={"mt-4"}>
              <Card task={task} color={color} />
            </div>
          </>,
          'Notes': <>
            {
              Array.isArray(notes) &&
              notes.map((note, i) => {
                return (
                  <div
                    className={`flex p-2 transition ease-in-out delay-250 hover:shadow-sm hover:shadow-green-400/40 rounded-lg duration-300 ${styles["note-display"]}`}
                    key={i}
                  >
                    <div className="mt-1">
                      <Image
                        alt="logo"
                        key={i}
                        width={40}
                        height={40}
                        className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
                        src={
                          note?.authorPictureURL ||
                          "https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg"
                        }
                      />
                    </div>

                    <div className="pl-4 relative w-full">
                      <p className="font-normal text-xs text-gray-500">
                        {note?.authorName || "..."}
                      </p>
                      <p className={`font-thin text-sm `}>
                        {note?.messageData?.text || "..."}
                      </p>
                      <div className="absolute top-0 right-0">
                        <p className="font-thin text-xs ">
                          <Moment fromNow>
                            {stampToDate(note?.timeCreated)}
                          </Moment>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </>,
          'About': <>
            <div className="space-y-4">
              <div className="bg-white rounded-lg flex p-4">
                <div>
                  <p className="font-semibold text-sm text-[#4B5563]">Email:</p>
                  <p className="">{customer?.emailAddress}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg flex p-4">
                <div>
                  <p className="font-semibold text-sm text-[#4B5563]">Phone Number:</p>
                  <p className="">{customer?.phoneNumber}</p>
                </div>
              </div>
              {
                contactPerson ?
                  <div className="bg-white rounded-lg flex p-4">
                    <div className="space-y-2">
                      <p className="font-semibold text-sm text-[#4B5563]">Contact Person:</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8">
                          <Image
                            alt={contactPerson?.name}
                            key={customer?.representativeProfileID}
                            width={"100%"}
                            height={"100%"}
                            className={`w-full object-cover rounded-md grow-0`}
                            src={
                              contactPerson?.pictureURL ||
                              "https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg"
                            }
                          />
                        </div>
                        <p className="">{contactPerson.name}</p>
                      </div>
                    </div>
                  </div> : null
              }
            </div>
          </>
        }[activeTab]}

        {!!text && sending && (
          <div className={`flex py-2`}>
            <div className="mt-1">
              <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
            </div>

            <div className="pl-4 relative w-full">
              <p className="font-normal">you</p>
              <p className={`font-thin text-sm `}>{text || "..."}</p>
              <div className="absolute top-0 right-0">
                <p className="font-thin text-xs ">now</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab == 'Notes' || activeTab == 'Activities' ?
        (<div
          className={`relative ${styles["notes-input-section"]} w-full bottom-0 `}
        >
          <div
            className={` w-full rounded-lg px-2 absolute bottom-0`}
            style={{
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "#00a85a",
            }}
          >
            <InputEmoji
              theme="light"
              value={text}
              onChange={setText}
              cleanOnEnter
              borderRadius={10}
              borderColor={"#FFF"}
              onEnter={handleKeyPress}
              placeholder="Type a message"
              onFocus={() => {
                if (sending) return;
              }}
            />
          </div>
        </div>) : null
      }


    </div >
  );
}

export default NotesList;
