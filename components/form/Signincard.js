import { useState } from "react";
import Router, { useRouter } from "next/router";
import "firebase/firestore";

import { signInWithCustomToken, sendSignInLinkToEmail } from "firebase/auth";
import { FBauth } from "../../configs/firebase-config";
import styles from "../../styles/Signin.module.css";
import fstyles from "../../styles/Forms.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

function Signincard() {
  const [email, setEmail] = useState();
  const [signinInitialized, setSignInInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const focusedClass = `transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102  duration-300`;
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "https://wakanda-business.vercel.app/finish-signin",
    // This must be true.
    handleCodeInApp: true,
    //dynamicLinkDomain: 'example.page.link'
  };
  const signin = async () => {
    if (!email) return;
    setLoading(true);
    setErrorMessage("");
    try {
      sendSignInLinkToEmail(FBauth, email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem("emailForSignIn", email);
          setSignInInitialized(true);
          //alert("successfully logged in!");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          
          
          alert("something went wrong signing in", errorCode.toString());
          // ...
        });
    } catch (err) {
     
      alert("something went wrong loggin in");
    }
    setLoading(false);
  };
  return (
    <div
      className={`${styles["card-body"]} mx-32 
      overflow-hidden w-full flex flex-col rounded-2xl shadow-lg bg-white transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102  duration-300 `}
    >
      {!signinInitialized && (
        <div className={`ml-6  w-full mt-8`}>
          <div>
            <p
              className={
                focusedClass +
                `transition ease-in-out font-normal text-lg ${fstyles["signin-title"]} `
              }
            >
              Sign In
            </p>
          </div>
        </div>
      )}
      {signinInitialized && (
        <div className="py-2 px-2 my-4">
          <div>
            <p
              className={
                focusedClass +
                `transition ease-in-out font-normal text-lg ${fstyles["signin-title"]} `
              }
            >
              Check your email
            </p>
          </div>

          <div className={` flex items-center my-2 w-full text-wrap`}>
            <p className="text-left ml-1 text-[18px] font-thin">
              We've sent a signin link to{" "}
              <span className={`font-[200px]`}>{email}</span>. If you don't find
              it, check your spam folder.
            </p>
          </div>
          <div
            className={` flex justify-between items-center mt-8 w-11/12`}
            onClick={(e) => {
              setSignInInitialized(false);
            }}
          >
            <p className="text-left ml-1 text-[16px] font-normal text-red-500">
              Try again
            </p>
          </div>
        </div>
      )}
      {!signinInitialized && (
        <div className="py-2 px-2 mt-8 ml-1">
          <label className="text-left pl-2 ml-1  font-thin">Email</label>
          <div
            className={`relative flex justify-between items-center pl-2 ${styles["signin-input"]}`}
          >
            <input
              placeholder="eg. rele@gmail.com"
              className={`border-b-2  p-2 pb-1 mb-2 w-11/12 text-sm focus:outline-none  `}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>
      )}
      {!signinInitialized && (
        <div className="py-2 mt-4 w-11/12 ml-2">
          <button
            onClick={() => {
              if (loading) return;
              signin();
            }}
            className={`transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-102 hover:bg-green-700 duration-300 ${styles["signin-button"]} w-full ml-2 font-semibold  py-3 px-4  rounded-lg drop-shadow-lg`}
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
              <span className="text-left">Log in</span>
            )}
          </button>
          {!!errormessage && (
            <div className="text-red-600 font-normal text-sm ml-3 justify-start w-full px-2 flex flex-row">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{
                  fontSize: 24,
                }}
                className={`text-red-500 ${styles["alert-shadow"]} motion-safe:animate-bounce`}
              />
              <div className="ml-2 mt-1 line-height-2 text-xs">
                {errormessage}
              </div>
            </div>
          )}
        </div>
      )}
      {loading && (
        <div
          className={`${styles["loader"]} p-4 flex-col flex-wrap pr-8 pt-0 h-full absolute bottom-0 bg-white flex justify-center items-center opacity-90`}
        >
          <FontAwesomeIcon
            icon={faSpinner}
            className={`${styles["spinner"]}`}
            style={{
              fontSize: 50,
              color: "#00a85a",
              alignSelf: "center",
            }}
          />
          <div className="mt-12 font-light text-sm text-[#00a85a] bg-white ">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}

export default Signincard;
