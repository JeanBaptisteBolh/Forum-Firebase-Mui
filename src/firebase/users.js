//Firebase documentation on authentication and realtime database
//https://firebase.google.com/docs/auth/web/start
//https://firebase.google.com/docs/database/web/read-and-write#web-version-9_2

import { initializeApp } from "@firebase/app";
// import { getAnalytics } from "@firebase/analytics";
import {
  getFirestore,
  connectFirestoreEmulator,
  query,
  getDocs,
  collection,
  where,
  setDoc,
  getDoc,
  doc,
} from "firebase/firestore";

import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

import firebaseConfig from "./config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Database Module
const db = getFirestore(app);

// FIREBASE EMULATOR
// if (window.location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

// Initialize Analytics
//const analytics = getAnalytics(app);

// Initialize google/facebook authentication modules
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Create a user using email
const createUserEmailPassword = async (firstname, lastname, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const docRef = doc(db, "users", user.uid)
    await setDoc(docRef, {
      firstname: firstname,
      lastname: lastname,
      email: email,
      authProvider: "local",
      posts: {},
      comments: {},
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


// Sign in via email/password
const loginEmailPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    return true;
  } catch (err) {
    console.error("FIREBASE ERROR: " + err);
    return false;
  }
};


// Sign in via google account
const loginGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    
    // Attempt to pull first and lastname out
    const nameArray = user.displayName.split(' ');
    const firstName = nameArray[0]
    let lastName = nameArray[nameArray.length - 1]
    if (lastName === firstName) {
      lastName = ""
    }

    if (docs.docs.length === 0) {
      const docRef = doc(db, "users", user.uid)
      await setDoc(docRef, {
        firstname: firstName,
        lastname: lastName,
        email: user.email,
        authProvider: "google",
        posts: {},
        comments: {},
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Send password reset link to an email address
const sendPassResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Logout.  Firebase will know what user is logged in through the auth variable.
const logout = () => {
  console.log("logging out");
  try { 
    auth.signOut();
  } catch (err) {
    console.error(err);
  }
};

// Check if user email already exists
const userEmailExists = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const docs = await getDocs(q);
  if (docs.docs.length > 0) {
    return true;
  } else { 
    return false;
  }
}

const getUserDisplayName = async (uid) => {      
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const name = docSnap.data().firstname + " " + docSnap.data().lastname
    return name;
  } else {
    return "";
  }
}

export {
  auth,
  db,
  createUserEmailPassword,
  loginEmailPassword,
  loginGoogle,
  sendPassResetEmail,
  logout,
  userEmailExists,
  getUserDisplayName,
}