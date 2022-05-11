import { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';

import Post from "./Post";
import { getAllPosts } from "../../firebase/forum";

const PostList = () => {
  const [postDataArray, setPostDataArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {  
    const getPostDataArray = async () => {
      try {
        const newPostDataArray = await getAllPosts().catch(console.error);
        setPostDataArray(newPostDataArray);
        setLoading(false);
      } catch(err) {
        console.error(err);
      }
    }
    
    getPostDataArray();
  }, []);

  return (
    <Box>

      <Stack spacing={2} sx={{ mx:2 }}>
        {postDataArray.map((postData) => {
          return(
            <Post
              key={postData.id}
              pid={postData.id}
              uid={postData.uid}
              title={postData.title}
              body={postData.body}
              upvotes={postData.upvotes - postData.downvotes}
            />
          )
        })}
      </Stack>
      <Pagination count={10} />
    </Box>
  )
};

export default PostList;
