import { useState, useEffect } from "react";
import Router from 'next/router';
import { useRouter } from "next/router";
import { FBdb, FBauth, onAuthStateChanged } from "../configs/firebase-config";
import Navbar from "../components/Navbar2";
import HeadComp from "../components/Head"; 
import Main from "../components/Main";
import {AuthenticateUser} from "../utils/functions"

export default function Home() {
  const [signedIn, setSignedIn] = useState(false); 

  useEffect(() => {
   const user =  AuthenticateUser();
   if(user){
    setSignedIn(true)
   }
  }, [signedIn]);


  return (
    <div>
      <HeadComp />
      <Navbar/>
      {/* <SigninIndex /> */}
      {signedIn && <Main />}
    </div>
  );
}
