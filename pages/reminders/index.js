import React, { useEffect, useState } from "react";
import Card from "../../components/tasks/Card";
// import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import {
  getDocs,
  collection,
} from "firebase/firestore";
import { FBdb, FBauth } from "../../configs/firebase-config";
import { getIdToken } from "firebase/auth";
import Nav from "../../components/Navbar2";
import Main from "../../components/Main";

function RemindersIndex() {

  return (
    <>
      <Nav />
      <Main/>
    </>
  );
}

export default RemindersIndex;
