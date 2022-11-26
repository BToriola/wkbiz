// import { api } from ".";

import { FBauth } from "../../configs/firebase-config";
import { getIdToken } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import { FBdb } from "../../configs/firebase-config";

// import { BASE_URL } from "../../utils/constants";
import axios from "axios";

const getIDtoken = async () => {
  const { currentUser } = FBauth;
  if (!currentUser) return;
 
  const token = await getIdToken(currentUser, true);
  return token;
};

export const getAllReminders = async () => {
  const oID = localStorage.getItem('organizationIDs')
  let parsedOID = JSON.parse(oID)
  const organizationID = parsedOID[0]
  let REMINDERS = [];
  const docRef = collection(FBdb, "Organizations", organizationID, "Reminders");
  const remindersSnap = await getDocs(docRef);
  remindersSnap.forEach((snap) => {
    const reminderDocument = snap.data();
    reminderDocument.xID = snap.id;
    REMINDERS.push(reminderDocument);
  });
  // setReminders(REMINDERS);
  return { data: REMINDERS };
};





export const createReminder = async ({
  title,
  description,
  repeatValue,
  customerID
  
}) => {
  const token = await getIDtoken();
  if (!token) {
    alert("User can't be authenticated");
  }
  const myUID = localStorage.getItem("userID");
  const oID = localStorage.getItem('organizationIDs')
  let parsedOID = JSON.parse(oID)
  const organizationID = parsedOID[0]

  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: "https://us-central1-wakanda-business.cloudfunctions.net/reminder",
        data: {
          myUID,
          title,
          description,
          idToken: token,
          action: "create",
          organizationID,
          creatorProfileID: myUID,
          customerProfileID: customerID,
          dueDateMillis: "17000000000000",
          repeat: repeatValue,
        },
      });
      resolve(res);
      // window.location.reload();
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
  
};

export const editReminder = async ({ title, reminderID, description, repeatValue }) => {
  return new Promise(async (resolve, reject) => {
  const token = await getIDtoken();
  if (!token) {
    alert("User can't be authenticated");
  }
  const myUID = localStorage.getItem("userID");
  const oID = localStorage.getItem('organizationIDs')
  let parsedOID = JSON.parse(oID)
  const organizationID = parsedOID[0]

  try {
    axios({
      method: "post",
      url: "https://us-central1-wakanda-business.cloudfunctions.net/reminder",
      data: {
        myUID,
        idToken: token,
        action: "edit",
        organizationID,
        reminderID,
        creatorProfileID: myUID,
        customerProfileID: "zsdHXw7jYBe2ZwZF6mmiuc4QlJR2",
        title,
        description,
        status:"UPCOMING",
        repeat:repeatValue
      },
    }).then((doc)=>{ 
      if (doc.data.msg === "SUCCESS") {
        resolve({msg:"SUCCESS"})
        //window.location.reload();
      }
    });
  } catch (error) {
    reject({msg:"ERROR"})
  }
});
};

export const deleteReminder = async (reminderID) => {
  return new Promise(async (resolve, reject) => {
  const token = await getIDtoken();
  if (!token) {
    alert("User can't be authenticated");
  }
  const myUID = localStorage.getItem("userID");
  const oID = localStorage.getItem('organizationIDs')
  let parsedOID = JSON.parse(oID)
  const organizationID = parsedOID[0]

  try {
   axios({
      method: "post",
      url: "https://us-central1-wakanda-business.cloudfunctions.net/reminder",
      data: {
        myUID,
        idToken: token,
        action: "delete",
        organizationID,
        reminderID,
      },
    })
    .then(async () => {
      let res = await getAllReminders();
      resolve({ data: res.data });
    });
  } catch (error) {
    reject({ data: error.response.data.toString() })
  }
})};


