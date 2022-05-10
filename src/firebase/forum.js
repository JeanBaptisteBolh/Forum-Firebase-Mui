import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc,
  getDoc, 
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
      //comments: {}, This is maybe useless.
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Create a forum post
const getPostData = async (pid) => {      
  const docRef = doc(db, "posts", pid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return;
  }
}

// const upvotePost = async () => {
//   const user = auth.currentUser

//   try {
//     const 
//   }

// }

export {
  createPost, 
  getPostData,
}