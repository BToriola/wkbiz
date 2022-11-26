import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getIdToken } from "firebase/auth";
import { FBauth, FBstorage } from "../configs/firebase-config";
import uuid from "react-uuid";
const base_url = "https://us-central1-wakanda-business.cloudfunctions.net/";
const storage = getStorage();
const validExts = ["jpg", "jpeg", "png", "PNG", "JPG", "JPEG"];
export const uploadImage = async (image, file) => {
  return new Promise(async (resolve, reject) => {
    let ext = file.name.split(".").pop();
    if (!validExts.includes(ext)) {
      reject({
        err: `Invalid file type of extension ${ext} supplied`,
        msg: "ERROR",
      });
    }

    try {
      let imgPath =
        "CRM/Web" +
        Math.floor(Math.random() * 8999999999999999 + 1000000000000000);
      +"." + ext;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });
      const imgRef = ref(storage, imgPath);
      uploadBytes(imgRef, blob).then(async (snapshot) => {
        let pictureURL = await getDownloadURL(imgRef);
        resolve({ pictureURL, msg: "SUCCESS" });
      });
    } catch (err) {
      //
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};
const setupRecord = (customerData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentUser } = FBauth;
      const idToken = await getIdToken(currentUser, true);
      const r = await fetch(base_url + "customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          myUID: currentUser?.uid,
          idToken: idToken,
          action: "addCustomer",
          organizationID: "i0OAsUwlAPnbV5JvnDJX",
          businessName: customerData?.businessName || "",
          emailAddress: customerData?.emailAddress || "",
          name: customerData?.name,
          phoneNumber: customerData?.phoneNumber || "",
          pictureURL: customerData?.pictureURL || "",
          representativeProfileID: localStorage.getItem("profileID"),
          alternativePhoneNumbers: customerData?.alternativePhoneNumbers || [],
        }),
      });
      let r2 = await r.json();
      resolve(r2);
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};
export const createFBrecord = (customerData, image, file) => {
  return new Promise(async (resolve, reject) => {
    if (image && file) {
      uploadImage(image, file)
        .then(async (data) => {
          let res = await setupRecord({
            ...customerData,
            pictureURL: data?.pictureURL,
          });
          return res;
        })
        .then((data) => {
          resolve({ msg: "SUCCESS", data });
        })
        .catch((err) => {
          reject({ msg: "ERROR", err });
        });
    } else {
      setupRecord(customerData)
        .then((data) => {
          resolve({ msg: "SUCCESS", data });
        })
        .catch((err) => {
          reject({ msg: "ERROR", err });
        });
    }
  });
};
export const uploadAttachment = async (file) => {
  const imagePath = `CRM/Attachments/${uuid()}.${file.name.split(".")[1]}`;
  const imageRef = ref(FBstorage, imagePath)
  await uploadBytes(imageRef, file)
  const imageURL = await getDownloadURL(imageRef)
  return imageURL
};

export const uploadCustomerImage = async (file) => {
  const imagePath = `CRM/Customers/${uuid()}.${file.name.split(".")[1]}`;
  const imageRef = ref(FBstorage, imagePath)
  await uploadBytes(imageRef, file)
  const imageURL = await getDownloadURL(imageRef)
  return imageURL
};

//Profile Edit/////////////////////////////////////////////////////////

const setupProfileEdit = (customerData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentUser } = FBauth;
      const idToken = await getIdToken(currentUser, true);
      const r = await fetch(base_url + "editProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          myUID: currentUser?.uid,
          idToken: idToken,
          name: customerData?.name,
          phoneNumber: customerData?.phoneNumber || "",
          pictureURL: customerData?.pictureURL || "",
        }),
      });
      let r2 = await r.json();
      resolve(r2);
    } catch (err) {
      reject({ err: err.toString(), msg: "ERROR" });
    }
  });
};

export const editFBprofile = (customerData, image, file) => {
  return new Promise(async (resolve, reject) => {
    if (image && file) {
      uploadImage(image, file)
        .then(async (data) => {
          let res = await setupProfileEdit({
            ...customerData,
            pictureURL: data?.pictureURL,
          });
          return res;
        })
        .then((data) => {
          resolve({ msg: data?.msg || "", data });
        })
        .catch((err) => {
          reject({ msg: "ERROR", err });
        });
    } else {
      setupProfileEdit(customerData)
        .then((data) => {
          resolve({ msg: "SUCCESS", data });
        })
        .catch((err) => {
          reject({ msg: "ERROR", err });
        });
    }
  });
};

//Profile Edit///////////////////////////////////////////////

export const updateFBrecord = (customerData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentUser } = FBauth;
      const idToken = await getIdToken(currentUser, true);
      const r = await fetch(base_url + "manageCommunityCRM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "editRecord",
          recordID: customerData.xID,
          communityID: "UwpulrxrXY5nIvZjIIYL",
          name: customerData.name,
          businessName: customerData?.businessName || "",
          emailAddress: customerData?.emailAddress || "",
          phoneNumber: customerData?.phoneNumber || "",
          alternativePhoneNumbers: customerData?.alternativePhoneNumbers || [],
          pictureURL: customerData?.pictureURL || "",
          managerProfileID: customerData?.managerProfileID,
          myUID: currentUser?.uid,
          idToken: idToken,
        }),
      });
      const r2 = await r.json();

      if (r2.msg === "SUCCESS") {
        resolve({ msg: "SUCCESS", data: r2 });
        //global.crmRecordUpdated?.(this.communityID, this.record.xID);
      } else {
        alert("Not successful, try again");
      }
    } catch (e2) {
      alert("An error occurred. Please try again");
      reject({ msg: "ERROR", err: e2 });
    }
  });
};

export const multiCreateFBrecords = (customerDatas, managerProfileID) => {
  return new Promise(async (resolve, reject) => {
    try {
      //if (!communityID) return alert("Error. Contact Import not possible")
      while (customerDatas.length > 0) {
        const record = customerDatas.shift();
        record.alternativePhoneNumbers = [];
        record.managerProfileID = managerProfileID;
        if (record?.alternativePhoneNumber1) {
          record['alternativePhoneNumbers'].push(record?.alternativePhoneNumber1);
        }
        if (record?.alternativePhoneNumber2) {
          record['alternativePhoneNumbers'].push(record?.alternativePhoneNumber2);
        }
        if (record.name) createFBrecord(record);
        await timeout(100);
        //data_length--;
      }
      resolve({ msg: "SUCCESS" });
    } catch (err) {
      alert("An error occurred creating records. Please try again");
      reject({ msg: "ERROR", err });
    }
  });
};

const timeout = async (ms) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const createRecord = async () => {
  //return;
  try {
    if (activityIndicatorAnimating) return;
    setActivityIndicatorAnimating(true);
    const r = await createFBrecord(customerData, pictureURL, pictureFile);
    setActivityIndicatorAnimating(false);
    if (r.msg === "SUCCESS") {
      await reload();
      alert("Success!");
      setShow("hidden");
      close();
    } else {
      alert("Not successful. Try again");
    }
  } catch (e2) {
    alert("An error occurred. Please try again", e2);
    //global.warn(e2, 'E5createRecord');
    setActivityIndicatorAnimating(false);
  }
};
