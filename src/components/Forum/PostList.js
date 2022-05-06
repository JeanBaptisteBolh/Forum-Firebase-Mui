import { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Post from "./Post";

import { db } from "../../firebase/auth";
import { 
  collection, 
  getDocs 
} from "firebase/firestore";
import { ConstructionOutlined } from "@mui/icons-material";

const PostList = () => {
  const [postDataArray, setPostDataArray] = useState([]);

  useEffect(() => {
    let unsubscribed = false;
  
    getDocs(collection(db, "posts"))
      .then((querySnapshot) => {
        if (unsubscribed) return; // unsubscribed? do nothing.
        const newPostDataArray = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPostDataArray(newPostDataArray);
      })
      .catch((err) => {
        if (unsubscribed) return; // unsubscribed? do nothing.
  
        // TODO: Handle errors
        console.error("Failed to retrieve data", err);
      });
  
    return () => unsubscribed  = true;
  }, []);

  return (
    <Box>
      <Stack spacing={2} sx={{ mx:2 }}>
        {postDataArray.map((postData) => {
          return(
            <Post
              title={postData.title}
              body={postData.body}
            />
          )
        })}
      </Stack>
      <Pagination count={10} />
    </Box>
  )
};

export default PostList;
