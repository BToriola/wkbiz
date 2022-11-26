import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { FBdb } from "../../configs/firebase-config";
import { Join } from "../../pages/api/organizationApi";
import  Router  from "next/router";

const Invite = ({ invitation }) => {
  const [name, setName] = useState("*****");
  const [organization, setOrganization] = useState("*****");
  const [image, setImage] = useState('')


  const JoinOrganization = async () => {
    try {
      let response = await Join();
      if (response.data.msg === "SUCCESS") {
        Router.push('/')
      } 
    } catch (err) {    }
  };


  useEffect(async () => {
    const nameInfo = await getDoc(
      doc(FBdb, "Profiles", invitation?.inviterProfileID)
      );

    if (nameInfo.exists()) {
      setName(nameInfo.data().name)
      setImage(nameInfo.data().pictureURL)
    }
  }, []);

  useEffect(async () => {
    const organizationInfo = await getDoc(
      doc(FBdb, "Organizations", invitation.organizationID)
    );
 
    if (organizationInfo.exists()) {
        setOrganization(organizationInfo.data().name)
    }
  }, []);

  return (
    <div className='justify-between flex items-center bg-[#EFF7F0] p-1 md:p-3 rounded-lg my-4'>
            <div className='w-5/12 md:w-4/12 flex items-center gap-2'>
                <div className='hidden md:block'>
                    <img className="w-10 h-10" src={image} alt="" />
                </div>

                <div>
                    <p className='font-bold'>{name}</p>
                </div>

            </div>

            <div className='md:w-2/12 hidden md:block'>
                <p>Invites you to Join</p>
            </div>

            <div className='w-full md:w-4/12 flex items-center gap-2'>
                <div className='hidden md:block'>
                    <img className="w-10 h-10" src={image} alt="" />
                </div>

                <div>
                    <p className='font-bold sm:text-xs'>{organization}</p>
                </div>

            </div>

            <div className='w-3/12 md:w-2/12'>
                <button className='p-2 md:p-3 bg-[#18A75D] text-center font-bold text-white rounded-lg cursor-pointer' onClick={() =>JoinOrganization()}>JOIN</button>

            </div>
        </div>
  );
};

export default Invite;
