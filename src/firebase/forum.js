import { create } from "@mui/material/styles/createTransitions";
import {
  collection,
  addDoc,
  setDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  query,
  where,
  FieldValue,
} from "firebase/firestore";

import { auth, db } from "./users";

/**
 * Create a new forum post
 * @param {string} title the post's title
 * @param {string} body the post's body
 * @return {boolean} true if successful, false otherwise
 */
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

/**
 * Create a new forum comment.
 * @param {string} body the comment's body
 * @return {boolean} true if successful, false otherwise
 */
const createComment = async (body) => {  
  // Create a new comment
  const newCommentRef = doc(collection(db, "comments"));
  try {
    const res = await setDoc(newCommentRef, {
      uid: auth.currentUser.uid,
      created: serverTimestamp(),
      body: body,
      upvotes: 0,
      downvotes: 0,
      //comments: {}, This is maybe useless.
    });
    return newCommentRef.id;
  } catch (err) {
    console.error(err);
    return;
  }
}

/**
 * Get and return an array of all forum posts
 * @return {array} An array of all forum posts
 */
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
 * Get and return an object containing the comments for a post
 * @param {number} pid A post id
 * @return {array} comments for the post
 */
const getCommentIdsForPost = async (pid) => {
  // TODO: Optimize this so we don't make 3 million calls.
  const postData = await getPostData(pid);

  if (postData !== undefined) {
    
    if ('comments' in postData) {
      const commentIds = Object.keys(postData.comments);
      return commentIds;
    } else {
      return [];
    }

  }
  return;
}

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
 * Get data for a single comment
 * @param {string} cid the comment's id
 * @return {object} a comment's data object
 */
 const getCommentData = async (cid) => {
  const docRef = doc(db, "comments", cid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return;
  }
};

/**
 * Get a users vote for a post
 * @param {string} id the post's id
 * @param {boolean} isPost True for posts, false for comments
 */
const getUserVote = async (id, isPost) => {
  const uid = auth.currentUser.uid;

  // Attempt to get the users info from firestore
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    // If the user exists, attempt to get their post votes object
    if (docSnap.exists()) {
      
      let userVotes;
      // Get either postvotes or commentvotes
      if (isPost) {
        userVotes = docSnap.data().postvotes;
      } else {
        userVotes = docSnap.data().commentvotes;
      }
      
      // If this is undefined, then the user has never voted on any post
      if (userVotes === undefined) return;
      
      // Otherwise get the vote for the id
      const userVote = userVotes[id];
      return userVote;
    } else {
      console.error("User not found in getUserVote");
    }
  } catch (err) {
    console.error(err)
  }

  return;
}

/**
 * Upvote the logged in user's vote on a post
 * @param {string} id the post's id
 * @param {true, false or null} vote value to be saved for the vote ()
 * @param {boolean} isPost True for posts, false for comments
 */
const updateUserVote = async (id, vote, isPost) => {
  /************** FIRST UPDATE USER'S UPVOTES/DOWNVOTES **************/
  const uid = auth.currentUser.uid;
  const docRef = doc(db, "users", uid);

  // This weird trick is necessary because our post vote key names are dynamic
  // https://stackoverflow.com/questions/47295541/cloud-firestore-update-fields-in-nested-objects-with-dynamic-key
  var voteUpdate = {};
  if (isPost) {
    voteUpdate[`postvotes.${id}`] = vote;
  } else {
    voteUpdate[`commentvotes.${id}`] = vote;
  }

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
    console.error(err);
    return;
  }
}

/**
 * Get a comments score by subtracting the downvotes from the upvotes
 * @param {string} cid the comment's id
 * @return {number} the score of the post
 */
 const getCommentScore = async (cid) => {
  try {
    const commentData = await getCommentData(cid);
    const commentScore = commentData.upvotes - commentData.downvotes;
    return commentScore;
  } catch (err) {
    console.error(err);
    return;
  }
}

/** 
 * Update the upvotes/downvotes fields on a post
 * @param {string} id the post's/comment's id
 * @param {true, false or null} previousVote the user's previous vote
 * @param {true, false or null} newVote the user's new vote
 * @param {boolean} isPost True for posts, false for comments
 */
const updateScore = async (id, previousVote, newVote, isPost) => {
  let docRef;
  if (isPost) {
    docRef = doc(db, "posts", id);
  } else {
    docRef = doc(db, "comments", id);
  }
  
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


const commentOnPost = async (pid, comment) => {
  const newCommentId = await createComment(comment);

  if (newCommentId == undefined) {
    console.error("No new Comment Id, probably an error in the creation of the comment")
    return;
  } else {
    // Add the comment id to the posts dictionary of comments
    const postDocRef = doc(db, "posts", pid);
    var updateDict = {};
    updateDict[`comments.${newCommentId}`] = true;
    try {
      const res = await updateDoc(postDocRef, updateDict);
    } catch (err) {
      console.error(err);
    }
  }
}

const commentOnComment = async (cid, comment) => {
  const newCommentId = await createComment(comment);

  if (newCommentId == undefined) {
    console.error("No new Comment Id, probably an error in the creation of the comment")
    return;
  } else {
    // Add the comment id to the comments dictionary of comments
    const commentDocRef = doc(db, "comments", cid);
    var updateDict = {};
    updateDict[`comments.${newCommentId}`] = true;
    try {
      const res = await updateDoc(commentDocRef, updateDict);
    } catch (err) {
      console.error(err);
    }
  }
}

/** 
 * Get an  object containing all comments and information about their children for the post
 * @param {string} pid the post id
 * @return {object} Object containing info about comments.  Looks like this:
 * children = {
 *   n0v91kfl: {
 *     depth: 0,
 *     children: {
 *       aksldc923: {
 *         depth: 1,
 *         children: {}
 *       }
 *     }
 *   }
 * }
 */
const getCommentsObject = async (pid) => {

  const getChildComments = async (id, depth) => {
    const commentRef = doc(db, "comments", id);
    const commentSnap = await getDoc(commentRef);
  
    let commentData = {};
    if ('comments' in commentSnap.data()) {
      const childrenComments = commentSnap.data().comments;
      for (const [key, value] of Object.entries(childrenComments)) {
        commentData[key] = await getChildComments(key, depth + 1);
      }
      return commentData;

    } else {
      return { 
        depth: depth,
        children: {}
      };
    }
  }

  // Get the data for the post
  const postData = await getPostData(pid);

  let commentData = {};
  // If there are comments for the post, dive through them recursively obtaining info
  // about each comment and their children comments
  if ('comments' in postData) {
    for (const [key, value] of Object.entries(postData.comments)) {
      commentData[key] = await getChildComments(key, 0);
    }
  }
  return commentData;
}




export { 
  createPost, 
  createComment,
  getAllPosts, 
  getCommentIdsForPost,
  getPostData,
  getCommentData,
  getUserVote,
  updateUserVote,
  getPostScore,
  getCommentScore,
  updateScore,
  commentOnPost,
  commentOnComment,
  getCommentsObject,
};
