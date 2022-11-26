// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut  } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDzm2Tv4RhWPhsTKGq83peT8jGrWfuyZSk",
	authDomain: "wakanda-business.firebaseapp.com",
	projectId: "wakanda-business",
	storageBucket: "wakanda-business.appspot.com",
	messagingSenderId: "742323242108",
	appId: "1:742323242108:web:feb323b4a02dc23e87f5f9",
	measurementId: "G-BTY64NDJ67"
  };

// Initialize Firebase
const FBapp = initializeApp(firebaseConfig);
const FBdb = getFirestore(FBapp);
const FBauth = getAuth();
const FBstorage = getStorage(FBapp);
export { FBapp, FBauth, FBdb, FBstorage, onAuthStateChanged, signOut };
