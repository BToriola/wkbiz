import Router, { useRouter } from "next/router";
import { FBauth, FBdb, onAuthStateChanged } from "../configs/firebase-config";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addUserData, logOutUser, userState } from "../redux/slices/userSlices";
import { fetchAllTasks, getAllTasksByMe } from "../redux/slices/tasksSlices";
import { taskState } from "../redux/slices/tasksSlices";

const initializeUserHook = () => {
  const [uid, setUID] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userDispatchHandler = (Data) => {
    dispatch(addUserData(Data));
  };

  //const user = useSelector((state) => state?.tasks?.tasks)
  const allTasks = useSelector(taskState);
  const taskDispatchHandler = () => {
    dispatch(fetchAllTasks());
  };
  const tasksByMeDispatchHandler = (data) => {
    dispatch(getAllTasksByMe(data));
  };

  const getlocalUserData = async () => {
    if (!uid) return;
    let USER_DATA = {};
    const userRef = doc(FBdb, "Users", uid);
    const userSnap = await getDoc(userRef);

    let profileID = "";
    profileID = userSnap?.data()?.profileID;
    let oIDs = userSnap?.data()?.organizationIDs || [];
    localStorage.setItem("organizationIDs", JSON.stringify(oIDs));

    if (oIDs.length <= 0) {
      alert("You do not belong to any organization");
      const createOrganization = confirm(
        "You might not be able to perform some actions. Would you like create one?"
      );
      if (createOrganization) {
        Router.push("setup")
      } else {
        dispatch(logOutUser());
      }
    }
    localStorage.setItem("userID", uid);

    const profileRef = doc(FBdb, "Profiles", profileID);
    const profileSnap = await getDoc(profileRef);
    localStorage.setItem("userName", profileSnap.data()?.name);
    localStorage.setItem("pictureURL", profileSnap.data()?.pictureURL);

    if (oIDs.length > 0) {
      const organizationRef = doc(FBdb, "Organizations", oIDs[0]);
      const organizationSnap = await getDoc(organizationRef);
      localStorage.setItem("organizationName", organizationSnap.data()?.name);
      USER_DATA["organizationName"] = organizationSnap.data()?.name;
    }

    //ref.current.complete();

    setLoading(false);
    USER_DATA["userData"] = userSnap.data();
    USER_DATA["profileID"] = profileID;
    USER_DATA["profileData"] = profileSnap.data();
    USER_DATA["userID"] = uid;
    USER_DATA["loading"] = false;
    USER_DATA["organizationIDs"] = oIDs;

    userDispatchHandler(USER_DATA);
    taskDispatchHandler();
    //tasksByMeDispatchHandler(allTasks?.tasks?.data || []);
  };

  const getUserID = async () => {
    try {
      const uid = FBauth?.currentUser?.uid;
      if (!uid) {
      } else if (uid) {
        localStorage.setItem("userID", uid);
        setUID(uid);
      }
    } catch (err) {
    }
  };
  useEffect(() => {
    // if (allTasks.tasksByMe && allTasks.tasksByMe.length > 0) return;
    getUserID();
    getlocalUserData();
  }, [uid]);

};
export default initializeUserHook;
