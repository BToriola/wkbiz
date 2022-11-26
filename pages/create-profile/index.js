/* ./pages/index.js               */
import { useState, useRef, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import HeadComp from "../../components/Head";
import styles from "../../styles/Signin.module.css";
import Istyles from "../../styles/Inbox.module.css";
import FormStyles from "../../styles/Forms.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { faSpinner, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FBauth } from "../../configs/firebase-config";
import { getIdToken } from "firebase/auth";

import SetupModal from "../../components/modals/SetupModal";
import { myInvites } from "../api/organizationApi";

export default function CreateProfileIndex() {
  const validExts = ["jpg", "jpeg", "png", "PNG"];

  const storage = getStorage();
  const router = useRouter();
  const inputFile = useRef(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idToken, setIDtoken] = useState("");
  const [myUID, setMyUID] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pictureURL, setPictureURL] = useState("");
  const [pictureFile, setPictureFile] = useState("");
  const onButtonClick = () => {
    inputFile.current?.click();
  };
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      setPictureFile(event.target.files[0]);
      reader.onload = (e) => {
        setPictureURL(e.target.result);
        //this.setState({image: e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const uploadImage = async (pictureURL, pictureFile) => {
    return new Promise(async (resolve, reject) => {
      let ext = pictureFile.name.split(".").pop();
      if (!validExts.includes(ext)) {
        reject({
          err: `Invalid file type of extension ${ext} supplied`,
          msg: "ERROR",
        });
      }

      try {
        let imgPath =
          "wakand-business/profile" +
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
          xhr.open("GET", pictureURL, true);
          xhr.send(null);
        });
        const imgRef = ref(storage, imgPath);
        let newPictureURL;
        uploadBytes(imgRef, blob).then(async (snapshot) => {
          newPictureURL = await getDownloadURL(imgRef);
          resolve({ newPictureURL, msg: "SUCCESS" });
        });
      } catch (err) {
        //
        reject({ err: err.toString(), msg: "ERROR" });
      }
    });
  };

  const getIDtoken = async () => {
    const { currentUser } = FBauth;
    if (!currentUser) return;

    const uid = await FBauth.currentUser?.uid;
    localStorage.setItem('userID', uid)
    
    setMyUID(uid);
    const email = await FBauth.currentUser?.email;
    setEmail(email);
    const token = await getIdToken(currentUser, true);
    setIDtoken(token);
  };
 

  const createProfile = async (pictureURL, pictureFile) => {
    if (!myUID) {
      alert("cant update account now, pls try again later");
      return;
    }
    if (loading) return;
    setLoading(true);
    let profileImg;
    try {
      if (pictureURL && pictureFile) {
        let profileUrl = await uploadImage(pictureURL, pictureFile);
        profileImg = profileUrl.newPictureURL;
      }
      
      const r = await fetch(
        "https://us-central1-wakanda-business.cloudfunctions.net/createAccount",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            myUID: myUID,
            idToken: idToken,
            email: email || "",
            phoneNumber: phoneNumber || "",
            pictureURL: profileImg || "",
            name: name,
          }),
        }
      );
      let r2 = await r.json();
      if (r2.msg === "SUCCESS") {
        alert("profile has been created");
        let invites = await myInvites();
        if (invites.data.invitations.length > 0) {
          Router.push("/introduction");
        } else {
          Router.push("/setup");
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(async() => {
   await getIDtoken();
  }, []);

  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-4 gap-6  py-16 pb-[200px]">
      <HeadComp />
      <div className="grid lg:col-span-4 sm:col-span-4  xs:col-span-3 gap-6  ">
        <div
          className={`mt-20 lg:w-5/12 sm:w-3/4 mx-auto  bg-white p-8  ${Istyles.datacard} shadow-lg ring-black rounded-lg mx-auto`}
        >
          <div className='"w-full flex flex-col'>
            <div className={` relative w-full py-4 ${Istyles.dataprofile}`}>
              <p className="font-normal text-lg">Create Profile</p>
            </div>
            <div
              className={`${Istyles["image-holder"]}  rounded-lg flex flex-col justify-center items-center`}
              onClick={onButtonClick}
            >
              <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={onImageChange}
              />
              {pictureURL && (
                <Image
                  alt="logo"
                  width={150}
                  height={150}
                  className={`${Istyles.profileimagewrapper} w-full object-cover rounded-lg grow-0`}
                  src={pictureURL}
                  onClick={onButtonClick}
                />
              )}
              {!pictureURL && (
                <FontAwesomeIcon
                  icon={faCamera}
                  style={{
                    fontSize: 36,
                    color: "#87AC9B",
                  }}
                />
              )}
              {!pictureURL && (
                <div className="text-center">
                  Profile <br /> Picture
                </div>
              )}
            </div>
            <div className="py-2 px-2 mt-0">
              <label className="text-left  font-thin">Name</label>
              <input
                placeholder="Name"
                value={name}
                className={`${FormStyles["text-input"]} w-full rounded-lg p-2 my-2`}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="py-2 px-2 mt-0">
              <label className="text-left  font-thin">Phone Number</label>
              <input
                placeholder="Phone Number e.g +2348059750900"
                className={`${FormStyles["text-input"]} w-full rounded-lg p-2 my-2 `}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
            </div>

            <div className="py-2 px-2 mt-4 w-full">
              <button
                className={`${styles["signin-button"]} items-center w-full font-semibold  py-3 px-4 border rounded-lg`}
                onClick={() => createProfile(pictureURL, pictureFile)}
              >
                {loading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className={`${styles["spinner"]}`}
                    style={{
                      fontSize: 30,
                      color: "#fff",
                    }}
                  />
                ) : (
                  <span className="text-left">Create Profile</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
