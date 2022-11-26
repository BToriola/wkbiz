/* ./pages/index.js               */
import { useEffect, useState } from "react";
import { FBauth } from "../../configs/firebase-config";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  getAdditionalUserInfo,
} from "firebase/auth";
import Router, { useRouter } from "next/router";
import HeadComp from "../../components/Head"; 
//alert("you're in finish-signin");
const signin = async () => {
  //setLoading(true);
  try {
    
    // Confirm the link is a sign-in with email link.
    const auth = getAuth();
    if (isSignInWithEmailLink(FBauth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          const { isNewUser } = getAdditionalUserInfo(result);
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          // if (typeof window !== "undefined") {window.alert("login completed!") };
          if (isNewUser) {
            Router.push("/create-profile");
          } else {
            Router.push("/");
          }
        })
        .catch((error) => {
          // window.alert("something went wrong pls try again!");
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
    //		Router.push('/');
  } catch (err) {
    // window.alert("cannot verify email sign in... ", err.toString());
  }
};

  
signin();
 
export default function FinishSignInindex() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const signin = async () => {
    setLoading(true);
    try {
      
      // Confirm the link is a sign-in with email link.
      const auth = getAuth();
      if (isSignInWithEmailLink(FBauth, window.location.href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        const email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt("Please provide your email for confirmation");
        }
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            // Clear email from storage.
            const { isNewUser } = getAdditionalUserInfo(result);
            window.localStorage.removeItem("emailForSignIn");
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
            // window.alert("login completed!");
            if (isNewUser) {
              Router.push("/create-profile");
            } else {
              Router.push("/");
            }
          })
          .catch((error) => {
            // window.alert("something went wrong pls try again!");
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          });
      }
      //		Router.push('/');
    } catch (err) {
      // window.alert("cannot verify email sign in... ", err.toString());
    }
  };

 /*  useEffect(()=>{ 
    signin()
  },[]) */
  


  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-4 gap-6  py-16">
      <HeadComp />
    </div>
  );
}