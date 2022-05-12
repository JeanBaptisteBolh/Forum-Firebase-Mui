import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";

import { auth, db } from "./users";

// Create a new forum post
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

// Get and return an array of all forum posts
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

/**
 * Get data for a single post
 * @param {string} pid the post's id
 * @return {object} a post's data object
 */
const getPostData = async (pid) => {
  const docRef = doc(db, "posts", pid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return;
  }
};

/**
 * Get a users vote for a post
 * @param {string} pid the post's id
 */
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
      const userVoteForPost = allUserPostVotes[pid];
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
const updateUserVoteForPost = async (pid, vote) => {
  /************** FIRST UPDATE USER'S UPVOTES/DOWNVOTES **************/
  const uid = auth.currentUser.uid;
  const docRef = doc(db, "users", uid);

  // This weird trick is necessary because our post vote key names are dynamic
  // https://stackoverflow.com/questions/47295541/cloud-firestore-update-fields-in-nested-objects-with-dynamic-key
  var voteUpdate = {};
  voteUpdate[`postvotes.${pid}`] = vote;

  // Update the user's post vote for the post pid
  await updateDoc(docRef, voteUpdate);
}

/**
 * Get a posts score by subtracting the downvotes from the upvotes
 * @param {string} pid the post's id
 * @return {number} the score of the post
 */
const getPostScore = async (pid) => {
  try {
    const postData = await getPostData(pid);
    const postScore = postData.upvotes - postData.downvotes;
    return postScore;
  } catch (err) {
    console.log(err);
    return;
  }
}

/** 
 * Update the upvotes/downvotes fields on a post
 * @param {string} pid the post's id
 * @param {true, false or null} previousVote the user's previous vote
 * @param {true, false or null} newVote the user's new vote
 */
const updatePostScore = async (pid, previousVote, newVote) => {
  const docRef = doc(db, "posts", pid);
  
  let updateDict = {};

  if (previousVote == null) {
    if (newVote === true) {
      updateDict = { upvotes: increment(1) }
    } 
    else if (newVote === false) {
      updateDict = { downvotes: increment(1) }
    }
  }

  else if (previousVote === true) {
    updateDict = { upvotes: increment(-1) }
    if (newVote === false) {
      updateDict["downvotes"] = increment(1);
    }
  }

  else if (previousVote === false) {
    updateDict = { downvotes: increment(-1) }
    if (newVote === true) {
      updateDict["upvotes"] = increment(1);
    }    
  }

  await updateDoc(docRef, updateDict);
}

export { 
  createPost, 
  getAllPosts, 
  getPostData,
  getUserVoteForPost,
  updateUserVoteForPost,
  getPostScore,
  updatePostScore,
};
