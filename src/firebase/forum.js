import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "./users";

// Create a forum post
const createPost = async (title, body) => {
  const user = auth.currentUser;
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

// Get and return an array of all posts
const getAllPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const postDataArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return postDataArray;
  } catch (err) {
    console.error("Failed to retrieve data", err);
    return;
  }
};

// Get data for a single post
const getPostData = async (pid) => {
  const docRef = doc(db, "posts", pid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return;
  }
};

// Get a users vote for a post
const getUserVoteForPost = async (pid) => {
  const uid = auth.currentUser.uid;

  // Attempt to get the users info from firestore
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    // If the user exists, attempt to get their post votes object
    if (docSnap.exists()) {
      const allUserPostVotes = docSnap.data().postvotes;

      // If this is undefined, then the user has never voted on any post
      if (allUserPostVotes === 'undefined') return;
      
      // Otherwise get the vote for the id
      console.log("All post votes: " + allUserPostVotes);
      const userVoteForPost = allUserPostVotes.pid;
      return userVoteForPost;
    } else {
      console.log("not found");
    }
  } catch (err) {
    console.error(err)
  }

  return;

  
}

/**
 * Upvote the logged in user's vote on a post
 * @param {string} pid the post's id
 * @param {true, false or null} vote value to be saved for the vote ()
 */
const updateVotePost = async (pid, vote) => {
  const uid = auth.currentUser.uid;
  const docRef = doc(db, "users", uid);

  // This weird trick is necessary because our post vote key names are dynamic
  // https://stackoverflow.com/questions/47295541/cloud-firestore-update-fields-in-nested-objects-with-dynamic-key
  var voteUpdate = {};
  voteUpdate[`postvotes.${pid}`] = vote;

  // Update the user's post vote for the post pid
  await updateDoc(docRef, voteUpdate);
}

export { 
  createPost, 
  getAllPosts, 
  getPostData,
  updateVotePost,
  getUserVoteForPost,
};
