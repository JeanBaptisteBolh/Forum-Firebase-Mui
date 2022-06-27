import { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';

import Post from "./Post";
import { getAllPosts } from "../../firebase/forum";

const PostList = (props) => {
  const [postDataArray, setPostDataArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {  
    console.log("reloading");
    const getPosts = async (searchText) => {
      try {
        let newPostDataArray = await getAllPosts().catch(console.error);
        // Search/Filter posts if necessary
        console.log("Before: " + newPostDataArray)
        if (searchText !== undefined && searchText !== "") {
          newPostDataArray = newPostDataArray.filter(
            (post) =>
              //post.title == "How bout them Canadians?"
              post.title.toLowerCase().includes(searchText.toLowerCase()) ||
              post.body.toLowerCase().includes(searchText.toLowerCase())
          )
          console.log("After: " + newPostDataArray)
        }
        setPostDataArray(newPostDataArray);
        setLoading(false);
      } catch(err) {
        console.error(err);
      }
    }

    getPosts(props.searchText);
  }, [props.searchText]);

  return (
    <Box>
      <Stack spacing={1} sx={{ mx:2, mb:1 }}>
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
