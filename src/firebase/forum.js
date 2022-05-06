import { useAuthState } from "react-firebase-hooks/auth";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
} from "firebase/firestore";

import { auth, db } from "./auth";

// Create a forum post
const createPost = async (title, body) => {
  const user = auth.currentUser
  //TODO: Check to make sure the user hasn't posted for 10 minutes.

  try {
    const res = await addDoc(collection(db, "posts"), {
      uid: user.uid,
      created: serverTimestamp(),
      title: title,
      body: body,
      upvotes: 0,
      downvotes: 0,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export {
  createPost, 
}