// import { api } from ".";

import { FBauth } from "../../configs/firebase-config";
import { query, where, getDocs, collection } from "firebase/firestore";
import { FBdb } from "../../configs/firebase-config";
import { onSnapshot } from "firebase/firestore";
import { getIdToken } from "firebase/auth";
// import { BASE_URL } from "../../utils/constants";
import axios from "axios";

export const getIDtoken = async () => {
  const { currentUser } = FBauth;

  if (!currentUser) return;
  const token = await getIdToken(currentUser, true);
  return token;
};


export const myInvites = async () => {
  const myUID = localStorage.getItem("userID");
  return new Promise(async (resolve, reject) => {
    const token = await getIDtoken();
    if (!token) {
      alert("User can't be authenticated");
    }
    try {
      const res = axios({
        method: "post",
        url: "https://us-central1-wakanda-business.cloudfunctions.net/organization",
        data: {
          myUID,
          idToken: token,
          action: "getMyInvites",
        },
      });
      resolve(res);
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};

export const Join = async () => {
  const token = await getIDtoken();
  const email = FBauth.currentUser?.email;
  if (!token) {
    alert("User cannot cannot be authenticated");
  }
  const myUID = localStorage.getItem("userID");
  return new Promise(async (resolve, reject) => {

    const oID = localStorage.getItem('organizationIDs')
    let parsedOID = JSON.parse(oID)
    const organizationID = parsedOID[0]
    try {
      const res = await axios({
        method: "post",
        url: "https://us-central1-wakanda-business.cloudfunctions.net/organization",
        data: {
          myUID,
          idToken: token,
          action: "join",
          organizationID: organizationID,
          email: email,
        },
      });

      resolve(res);
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};
export const Create = async (name, profileImg) => {
  const token = await getIDtoken();
  if (!token) {
    alert("User can't be authenticated");
  }


 
   
  const myUID = localStorage.getItem("userID");
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: "https://us-central1-wakanda-business.cloudfunctions.net/organization",
        data: {
          "myUID": myUID,
          "idToken": token ,
          "action":"create",
          "name":name,
          "pictureURL":profileImg || '',
        },
      });

      resolve(res);
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};
export const Invite = async (emails, id) => {
  const token = await getIDtoken();
  const email = FBauth.currentUser?.email;
  if (!token) {
    alert("User can't be authenticated");
  }
  const myUID = localStorage.getItem("userID");
  const profileID = localStorage.getItem("profileID");

  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: "https://us-central1-wakanda-business.cloudfunctions.net/organization",
        data: {
          myUID,
          idToken: token,
          "action":"invite",
          "organizationID":id,
          "inviteList":emails,
          "inviterProfileID":profileID}
      });

      resolve(res);
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};
