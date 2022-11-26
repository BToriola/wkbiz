import { useState, useRef, useEffect } from "react";
import Router, { useRouter } from "next/router";
import HeadComp from "../../components/Head";
import styles from "../../styles/Signin.module.css";
import Istyles from "../../styles/Inbox.module.css";
import FormStyles from "../../styles/Forms.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FBauth } from "../../configs/firebase-config"; 
import Image from "next/image";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { userState } from "../../redux/slices/userSlices";
import { editFBprofile } from "../../utils/firebase";
import { useMutation } from "react-query";

function CreateEditProfile({ display, close }) {
  let userName = localStorage.getItem('userName')
  const user = useSelector((state) => state?.user?.user)
  const userBody = useSelector(userState);
  const inputFile = useRef(null);  
	const [show, setShow] = useState(display);
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pictureURL, setPictureURL] = useState(userBody?.user?.profileData?.pictureURL || "");
  const [pictureFile, setPictureFile] = useState("");
  const [userData, setUserData] = useState({
    pictureURL: user?.profileData?.pictureURL,
    name: user?.profileData?.pictureURL || userName,
    phoneNumber:user?.profileData?.phoneNumber,
  });

  const validExts = ["jpg", "jpeg", "png", "PNG", "JPG", "JPEG"];
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


 

  const editProfile = async () => {
    //return;
    try {
      if (activityIndicatorAnimating) return;
      setActivityIndicatorAnimating(true);
      const r = await editFBprofile(userData,pictureURL, pictureFile); 
      setActivityIndicatorAnimating(false);
      if (r.msg === "SUCCESS") {
       // await reload();
        alert("Success!");
        setShow("hidden");
        close();
      } else {
        alert("Not successful. Try again");
      }
    } catch (e2) {
      alert("An error occurred. Please try again", e2.toString());
      //global.warn(e2, 'E5createRecord');
      setActivityIndicatorAnimating(false);
    }
  };
  useEffect(() => {
		setShow(display);
	}, [display]);
  return (
    <>
      <div className={`fixed ${show} inset-0 z-30 overflow-y-auto`}>
        <div className="fixed inset-0 w-full h-full bg-black opacity-75" 
        onClick={()=>{
          setShow('hidden');
          close();
        }}></div>

        <div className="flex items-center min-h-screen px-4 py-8">
          <div className="relative  md:w-[395px] w-full max-w-lg px-6 py-3 mx-auto bg-[#FFFFFF] rounded-xl shadow-[#18A75D26] shadow-lg z-50">
            <div
              className=" w-10 h-10 bg-white rounded-full text-base font-bold text-[#163828] border-[#163828] border-4 flex justify-center items-center absolute  sm:left-[318px]  md:left-[366px] -top-3"
              onClick={()=>close()}
            >
              <Image src="/menu.svg" alt="Wakanda" width={65} height={35} />
            </div>
            <div className={` relative w-full py-4 ${Istyles.dataprofile}`}>
              <p className="font-normal text-lg">Edit Profile</p>
            </div>

            <div className="flex flex-col">
              <div className={`${Istyles["image-holder"]}  rounded-lg flex flex-col justify-center items-center`} onClick={onButtonClick}>
                <input type="file" id="file" ref={inputFile} style={{ display: "none" }} onChange={onImageChange} />
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

              <div className="flex flex-col my-2 ">
                <label htmlFor="name" className=" font-body font-semibold  text-xs text-[#648B7A] py-2">
                  Name
                </label>
                <input
                  className="bg-[#EFF7F0]  border-[#87AC9B] shadow-inner rounded-lg p-2 flex-1 border-[0.5px]"
                  id="name"
                  type="text"
                  value={userData?.name}
                  aria-label="Name"
                  placeholder="Enter new name"
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        name: e.target.value,
                      };
                    });
                  }}
                />
              </div>
              <div className="flex flex-col my-3">
                <label htmlFor="name" className=" font-body font-semibold  text-xs text-[#648B7A] py-2">
                  Phone No
                </label>
                <input
                  className="bg-[#EFF7F0]  border-[#87AC9B] shadow-inner rounded-lg p-2 flex-1 border-[0.5px]"
                  id="phone number"
                  type="phone number"
                  aria-label="phone number"
                  placeholder="Enter your phone number"
                  value={userData?.phoneNumber}
                  onChange={(e) => {
                    setUserData((prev) => {
                      return {
                        ...prev,
                        phoneNumber: e.target.value,
                      };
                    });
                  }}
                />
              </div>

              {activityIndicatorAnimating && <div className="absolute bottom-0 w-full left-0 h-full bg-white self-center opacity-70"></div>}
              <div className=" items-center px-0 py-3   w-full pl-1 self-center">
                <button
                  id="ok-btn"
                  className={`${Istyles["customer-button"]} flex flex-row justify-center px-4 py-2 mb-0 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 `}
                  onClick={async () => {
                    editProfile();
                  }}
                >
                  {activityIndicatorAnimating ? "updating..." : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateEditProfile;
