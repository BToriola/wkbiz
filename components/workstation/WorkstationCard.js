import Image from "next/image";

import React, { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { sendChat } from "../../pages/api/taskApi";
import { getIdToken } from "firebase/auth";
import { stampToDate } from "../../utils/dateConverter";
import Card from "../tasks/Card";
import { useSelector, useDispatch } from "react-redux";
import { userState, userData } from "../../redux/slices/userSlices";
import { getDocs, collection, onSnapshot, doc } from "firebase/firestore";
import { FBdb, FBauth } from "../../configs/firebase-config";
import { Attach, NewTask, Smiley } from "../icons";
import { Oval } from "react-loading-icons";
import TaskModal from "../modals/TaskModal";

import Picker from 'emoji-picker-react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import FileIcon from "../icons/FileIcon";
import SendIcon from "../icons/SendIcon";
import { uploadAttachment } from "../../utils/firebase";

// function useChatScroll(dep) {
//   const ref = React.useRef();
//   React.useEffect(() => {
//     if (ref.current) {
//       ref.current.scrollTop = ref.current.scrollHeight;
//     }
//   }, [dep]);
//   return ref;
// }

export default function WorkstationCard({ reminder }) {
  const [chat, setChat] = useState("");
  const [chatID, setChatID] = useState("");
  const [myProfileID, setMyProfileID] = useState("");
  const [myProfilePictureURL, setMyProfilePictureURL] = useState("");
  const [myProfileName, setMyProfileName] = useState("");
  const [showNewTaskButton, setShowNewTaskButton] = useState(false);
  const [emojiPopup, setEmojiPopup] = useState(false);
  const [file, setFile] = useState(null);
  // const [myProfilePicture, setMyProfilePicture] = useState("");

  const [chatMessages, setChatMessages] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState("hidden");
  // const [messagesEndRef] = useRef(null)
  // const ref = useChatScroll(chatMessages)
  const messagesEndRef = useRef(null);


  const userBody = useSelector(userState);
  let myUID = userBody?.user?.userID;
  let localStorageUID = localStorage.getItem("userID");

  const onEmojiClick = (emojiObject) => {
    setChat((chat + emojiObject.emoji).trim());
    toggleEmojiPopup();
  };

  const toggleEmojiPopup = () => {
    setEmojiPopup(!emojiPopup);
  }

  const closeEmojiPopup = () => {
    setEmojiPopup(false);
  }

  const openFileWindow = () => {
    const inputref = document.getElementById("file-attachment")
    inputref.click()
  }

  const uploadFile = async (event) => {
    const file = event.target.files[0];
    setFile(file);
  }

  const removeFile = () => {
    setFile(null);
  }

  const downloadFile = async (link, author) => {
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";
    anchor.download = `Wakanda CRM Attachment from ${author}`;

    document.body.appendChild(anchor)
    anchor.click();
    document.body.removeChild(anchor)
  }

  const emojiPopupRef = useDetectClickOutside({ onTriggered: closeEmojiPopup });

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    try {
      const fileURL = null;
      const tempFile = file;
      removeFile();
      setChat("");

      if (tempFile)
        fileURL = await uploadAttachment(tempFile)

      setChatMessages([...chatMessages, {
        authorPictureURL: myProfilePictureURL,
        authorProfileID: myProfileID,
        messageData: { text: chat, file: fileURL },
        timeCreated: 'sending'
      }])

      let response = await sendChat(chat, fileURL);
      if (response.data.msg === "SUCCESS") {
      }
    } catch (err) {
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
    let unsub2;
    const unsub = onSnapshot(doc(FBdb, "Users", localStorageUID), (userDoc) => {
      setMyProfileID(userDoc?.data()?.profileID);
      const profileID = userDoc?.data()?.profileID;
      localStorage.setItem("profileID", profileID);
      if (!myProfileName) {
        unsub2 = onSnapshot(doc(FBdb, "Profiles", profileID), (profileDoc) => {
          setMyProfilePictureURL(profileDoc.data()?.pictureURL || "");
          setMyProfileName(profileDoc.data()?.name || "");
        });
      }
    });

    return () => {
      unsub();
      unsub2?.();
    };
  }, []);

  const fetchChats = async () => {
    const docRef = collection(
      FBdb,
      "Organizations",
      "i0OAsUwlAPnbV5JvnDJX",
      "Chats"
    );
    const chatsSnap = await getDocs(docRef);
    chatsSnap.forEach((chat) => {
      const chatDocument = chat.data();
      chatDocument.xID = chat.id;
      setChatID(chat.id);
      let cMSG = chatDocument.messages;
      setChatMessages(cMSG);
    });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    // if (!workstation) return;
    const unsub = onSnapshot(
      doc(
        FBdb,
        "Organizations",
        "i0OAsUwlAPnbV5JvnDJX",
        "Chats",
        "workstation"
      ),
      (doc) => {
        scrollToBottom();
        setChatMessages(doc.data()?.messages);
      }
    );
    return () => unsub();
  }, []);

  if (!chatMessages.length)
    return (
      <div className=" flex justify-center items-end mt-[200px]">
        <Oval stroke="#00A85A" strokeWidth={4} height='2em'/>
      </div>
    );
  return (
    <div className="max-w-3xl mt-4 bg-white items-center justify-center p-4 md:pt-12 md:px-8 pb-2 rounded-xl">
      <div>
        <div className="w-full">
          <div
            className="relative w-full lg:pt-6 overflow-y-scroll h-[32rem]"
            ref={messagesEndRef}
          >
            <ul className="space-y-4 overflow-y-auto w-full overflow-x-hidden">
              <li className="flex justify-center">
                <div className="relative max-w-xl px-2 py-1 text-xs text-[#87AC9B] border rounded-2xl border-[#87AC9B] ">
                  <span className="block">Today</span>
                </div>
              </li>
              <li className="px-2 space-y-6">
                {chatMessages.map((chat, id) => {
                  if (chat.authorProfileID !== myProfileID)
                    return (
                      <div
                        key={id}
                        className="flex space-x-3"
                      >
                        <div className="rounded-md overflow-hidden w-10 h-10 bg-[#EFF7F0]">
                          {chat.authorPictureURL && (<Image src={chat.authorPictureURL} width={40} height={40} objectFit="cover" />)}
                        </div>
                        <div
                          className="text-[#163828] text-sm grid justify-items-start max-w-[60%] w-max">
                          <p className=" font-bold -mb-0">{chat.authorName}</p>
                          <div className="flex items-center space-x-2 w-full">
                            <div className="space-y-2">
                              <p className="text-sm font-medium break-words">
                                {chat.messageData.text}
                              </p>
                              {
                                chat.messageData.file &&
                                <div className="border border-green-700 rounded-lg flex items-center p-2 px-3 ml-auto w-max cursor-pointer transition-all hover:border-transparent hover:text-white hover:bg-green-800"
                                  onClick={() => downloadFile(chat.messageData.file, chat.authorName)}>
                                  <span className="text-[10px]">Download Attachment</span>
                                  <FileIcon />
                                </div>
                              }
                            </div>
                            <p className="text-[#87AC9B] text-xs whitespace-nowrap">
                              <Moment fromNow>
                                {stampToDate(chat?.timeCreated)}
                              </Moment>
                            </p>
                          </div>
                        </div>
                      </div>

                    );
                  if (chat.authorProfileID === myProfileID)
                    return (
                      <div
                        key={id}
                        className="flex space-x-3 items-start justify-end"
                      >
                        <div
                          className={`grid justify-end max-w-[65%] w-max ${chat.timeCreated == 'sending' ? 'text-gray-300' : 'text-[#163828]'}`}>
                          <div className="flex items-center justify-end space-x-2 w-full">
                            <p className={`text-xs whitespace-nowrap ${chat.timeCreated == 'sending' ? 'text-gray-300' : 'text-[#87AC9B]'}`}>
                              {chat.timeCreated == 'sending' ? 'sending...' :
                                <Moment fromNow>
                                  {stampToDate(chat?.timeCreated)}
                                </Moment>
                              }
                            </p>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-right break-words">
                                {chat.messageData.text}
                              </p>
                              {
                                chat.messageData.file &&
                                <div className="border border-green-700 rounded-lg flex items-center p-2 px-3 ml-auto w-max cursor-pointer transition-all hover:border-transparent hover:text-white hover:bg-green-800"
                                  onClick={() => downloadFile(chat.messageData.file, chat.authorName)}>
                                  <span className="text-[10px]">Download Attachment</span>
                                  <FileIcon />
                                </div>
                              }
                            </div>
                          </div>
                        </div>

                        <div className="rounded-md overflow-hidden w-10 h-10 bg-[#EFF7F0]">
                          {chat.authorPictureURL && (<Image src={chat.authorPictureURL} width={40} height={40} objectFit="cover" />)}
                        </div>
                      </div>

                    );
                })}
              </li>
              <li className="flex justify-center">
                <div className="relative max-w-xl px-2 py-1 text-xs text-[#87AC9B] border rounded-2xl border-[#87AC9B] ">
                  <span className="block text-xs">Bolaji Clock in @ 9:05am</span>
                </div>
              </li>
              <li className="flex justify-end">
                <div className="relative max-w-xl px-4 pt-16 pb-4 text-gray-700 "></div>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between w-full p-3 border-t  border-[#EFF7F0]">
            <div className="relative" ref={emojiPopupRef}>
              <Smiley className="cursor-pointer" onClick={toggleEmojiPopup} width={38} />

              {emojiPopup && <div className="absolute bottom-0 left-0 ">
                <Picker onEmojiClick={onEmojiClick} previewConfig={{ showPreview: false }} />
              </div>}
            </div>
            <button>
              <Attach onClick={openFileWindow} width={38} />
              <input onChange={(e) => { uploadFile(e) }} type="file" hidden id="file-attachment" />
            </button>

            <div
              className="block border-[#648B7A] space-y-4 border w-full py-2 px-4 mx-3 bg-[#EFF7F0] rounded-xl focus:text-gray-700">
              <input
                type="text"
                placeholder="Type Here ..."
                value={chat}
                id="chat_text"
                name="message"
                className="w-full bg-transparent outline-none"
                required
                onChange={(e) => setChat(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {file &&
                (<div className="relative border rounded-md border-green-900 w-max bg-white flex items-center justify-center p-2">
                  <div className="absolute -top-3 -right-3 rounded-full leading-none py-1 px-2 bg-white cursor-pointer" onClick={removeFile}>x</div>
                  <FileIcon />
                </div>
                )
              }
            </div>

            {showNewTaskButton && (
              <button className="transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 duration-300 bg-white border absolute right-56 bottom-[320px] px-4 py-1 rounded-md font-bold border-gray-700" onClick={() => setShowTaskModal("block")}>
                Create New Task
              </button>
            )}
            {chat.length >= 1 ?
              (<button className="bg-green-600 rounded-full p-3" onClick={sendMessage}>
                <SendIcon color={"#FFFFFF"} />
              </button>) :
              (<button onClick={() => setShowNewTaskButton(!showNewTaskButton)}>
                <NewTask width={38} />
              </button>)

            }
            {/* <button type="submit">
                <svg
                  class="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button> */}
          </div>
        </div>
      </div>
      <TaskModal
        display={showTaskModal}
        close={() => {
          setShowTaskModal("hidden");
        }}
      />
    </div>
  );
}
