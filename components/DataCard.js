import React, { useState } from "react";
import styles from "../styles/Inbox.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faComment, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import CustomerModal from "./modals/CustomerModal";
function DataCard({ user }) {
  const [showCustomerModal, setShowCustomerModal] = useState('hidden');

  return (
    <div className={` py-8 w-full bg-white p-8 ${styles.datacard} shadow-lg ring-black rounded-lg lg:w-96 space-y-4  mb-3 sm:col-span-1 md:col-span-2`}>
      <div className="flex  w-full ">
        <div className="flex w-[80%]">
          <div>
            <Image
              alt="logo"
              width={60}
              height={60}
              className={`${styles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
              src={user?.pictureURL || "https://cdn.pixabay.com/photo/2017/08/06/09/52/black-and-white-2590810_1280.jpg"}
            />
          </div>

          <div className={`relative w-full ml-4`}>
            <p className="font-normal text-[1rem]">{user?.name || "Bolaji Dauda"}</p>
            <p className="font-thin text-xs">{user?.businessName || "Elevated Designs"}</p>
          </div>
        </div>
        <div className={` flex w-[20%] justify-end items-start`} >
          {user?.type ? (
            <div className={`rounded p-1 px-2`} style={{ backgroundColor: "#90be16" }}>
              <p className={`font-normal text-[0.65rem] text-white text-center`}>{user.type}</p>
            </div>
          ) : null}
          <button className={`p-1 `} style={{ marginTop: -3 }}>
            <FontAwesomeIcon icon={faEllipsisV} style={{ fontSize: 20, color: "#648B7A" }}
              onClick={() => setShowCustomerModal('block')} />
          </button>
        </div>
      </div>
      <div className={` relative w-full ${styles.dataprofile} border-0`} style={{ borderWidth: 0 }}>
        <div className="flex lg:justify-between">
          {user?.emailAddress && <a href={`mailto:${user.emailAddress}`}>
            <button className={`${styles.contactButton} font-semibold  py-2 px-4 border rounded-lg flex justify-center items-center`}>
              <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: 20 }} /> <span className="text-xs px-2">Email</span>
            </button>
          </a>
          }
          {user?.phoneNumber && <a href={`tel:${user.emailAddress}`}>
            <button className={`${styles.contactButton} ml-2 font-semibold py-2 px-4 border rounded-lg flex justify-center items-center`}>
              <FontAwesomeIcon icon={faPhone} style={{ fontSize: 20 }} /> <span className="text-xs px-2">Call</span>
            </button>
          </a>
          }
          {user?.phoneNumber && <a href={`sms:${user.emailAddress}`}>
            <button className={`${styles.contactButton} ml-2 font-semibold py-2 px-4 border rounded-lg flex justify-center items-center`}>
              <FontAwesomeIcon icon={faComment} style={{ fontSize: 20 }} /> <span className="text-xs px-2">Text</span>
            </button>
          </a>
          }
        </div>
      </div>
      {(user?.services?.length > 0 && Array.isArray(user.services)) ? (
        <div className={`relative w-full`}>
          <p className="font-normal text-[1rem]">Services :</p>
          <p className="font-thin text-xs">
            {user.services.map((service, index) => {
              return (
                <span key={index}>{service}{index + 1 < user.services.length ? ', ' : ""} </span>
              )
            })}
          </p>
        </div>
      ) : null}
      <CustomerModal
        display={showCustomerModal}
        close={() => {
          setShowCustomerModal('hidden');
        }}
        customer={user}
      />
    </div>
  );
}

export default DataCard;
