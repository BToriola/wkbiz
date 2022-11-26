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

export const getAllTasks = async () => {
  const oID = localStorage.getItem('organizationIDs')
  let parsedOID = JSON.parse(oID)
  const organizationID = parsedOID[0]
  const profileID = localStorage.getItem("profileID");
  let TASKS = [];
  const docRef = collection(FBdb, "Organizations", organizationID, "Tasks");
  const q = query(docRef, where("assignerProfileID", "==", profileID));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((snap) => {
    const taskDocument = snap.data();
    taskDocument.xID = snap.id;
    TASKS.push(taskDocument);
  });
 
  return { data: TASKS };
};



export const createTask = async ({ title, dueDateMillis, assigneeProfileID }) => {
  return new Promise(async (resolve, reject) => {
    const token = await getIDtoken();
    if (!token) {
      alert("User can't be authenticated");
    }
    const myUID = localStorage.getItem("userID");
    const profileID = localStorage.getItem("profileID");
    const oID = localStorage.getItem('organizationIDs')
    let parsedOID = JSON.parse(oID)
    const organizationID = parsedOID[0]

    try {

      axios({
        method: "post",
        url: "https://us-central1-wakanda-business.cloudfunctions.net/task",
        data: {
          myUID,
          idToken: token,
          action: "create",
          organizationID,
          assigneeProfileID: profileID,
          status: "NEW",
          dueDateMillis,
          title,
        },
      })
        .then(async () => {
          let res = await getAllTasks();
          resolve({ data: res.data });
        });
    } catch (error) {
      reject({ data: error.toString() });
    }
  });
};


export const editTask = async ({ title, taskID, DueDate }) => {
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
      url: "https://us-central1-wakanda-business.cloudfunctions.net/task",
      data: {
        myUID,
        idToken: token,
        action: "edit",
        organizationID,
        taskID,
        title,
      },
    }).then(
      onSnapshot((doc) => {
        if (doc.data.msg === "SUCCESS") {
          window.location.reload();
        }
      })
    );
  } catch (error) {
  }
};

export const deleteTask = async (taskID) => {
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
        url: "https://us-central1-wakanda-business.cloudfunctions.net/task",
        data: {
          myUID,
          idToken: token,
          action: "delete",
          organizationID,
          taskID,
        },
      })
        .then(async () => {
          let res = await getAllTasks();
          resolve({ data: res.data });
        });
    } catch (error) {
      reject({ data: error.response.data.toString() })
    }
  });
};

export const markRead = async (taskID) => {
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
      url: "https://us-central1-wakanda-business.cloudfunctions.net/task",
      data: {
        myUID,
        idToken: token,
        action: "markread",
        organizationID,
        taskID,
      },
    }).then((doc) => {
      return doc;
    });
  } catch (error) {
  }
};

export const markedDone = async (taskID, doneState) => {
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
      url: "https://us-central1-wakanda-business.cloudfunctions.net/task",
      data: {
        myUID,
        idToken: token,
        action: "markDone",
        organizationID,
        taskID,
        markDone: true,
      },
    }).then((doc) => {
      return doc;
    });
  } catch (error) {
  }
};

export const sendChat = async (chat, fileURL) => {
  const token = await getIDtoken();
  if (!token) {
    alert("User can't be authenticated");
  }
  const myUID = localStorage.getItem("userID");
  const messageData = { text: chat, file: fileURL }

  const oID = localStorage.getItem('organizationIDs')
  let parsedOID = JSON.parse(oID)
  const organizationID = parsedOID[0]

  if (!fileURL)
    delete messageData.file

  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios({
        method: "post",
        url: "https://us-central1-wakanda-business.cloudfunctions.net/workstation",
        data: {
          myUID,
          idToken: token,
          action: "sendMessage",
          organizationID,
          messageData,
        },
      });

      resolve(res);
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};
