import { useState, useEffect } from "react";

import { Stack, Pagination, Box, Button } from "@mui/material";
import { orange } from '@mui/material/colors';

import WhatshotIcon from '@mui/icons-material/Whatshot';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

import Post from "./Post";
import { getAllPosts } from "../../firebase/forum";

const PostList = (props) => {
  const [postDataArray, setPostDataArray] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortPosts, setSortPosts] = useState("New");
  const [sortNewFlag, setSortNewFlag] = useState(true);
  const [sortBestFlag, setSortBestFlag] = useState(false);

  useEffect(() => {
    console.log("reloading");
    const getPosts = async (searchText) => {
      try {
        let newPostDataArray = await getAllPosts().catch(console.error);
        // Search/Filter posts if necessary
        if (searchText !== undefined && searchText !== "") {
          newPostDataArray = newPostDataArray.filter(
            (post) =>
              //post.title == "How bout them Canadians?"
              post.title.toLowerCase().includes(searchText.toLowerCase()) ||
              post.body.toLowerCase().includes(searchText.toLowerCase())
          );
        }

        // Sort the post data array by timestamp/popularity
        if (sortPosts === "New") {
          newPostDataArray.sort((post1, post2) =>
            post1.created.seconds < post2.created.seconds ? 1 : -1
          );
        } else {
          newPostDataArray.sort((post1, post2) =>
            (post1.upvotes - post1.downvotes) < (post2.upvotes - post2.downvotes)
              ? 1
              : -1
          );
        }

        setPostDataArray(newPostDataArray);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    getPosts(props.searchText);
  }, [props.searchText]);

  const handleNewSort = () => {
    setSortPosts("New");
    setSortNewFlag(true);
    setSortBestFlag(false);
    setPostDataArray(
      postDataArray.sort((post1, post2) =>
        post1.created.seconds < post2.created.seconds ? 1 : -1
      )
    );
  };

  const handleBestSort = () => {
    setSortPosts("Best");
    setSortNewFlag(false);
    setSortBestFlag(true);
    setPostDataArray(
      postDataArray.sort((post1, post2) =>
        (post1.upvotes - post1.downvotes) < (post2.upvotes - post2.downvotes)
          ? 1
          : -1
      )
    );
  };

  return (
    <Box>
      <Box sx={{ ml: 2, mb: 1 }}>
        <Button
          onClick={handleNewSort}
          variant="contained"
          style={{ 
            textTransform: 'none',
            backgroundColor: sortNewFlag ? orange[500] : "inherit",
            color: sortNewFlag ? "white" : "grey"
          }}
          sx={{ 
            boxShadow: 0, 
            mr: 1,
          }} 
        >
          New<NewReleasesIcon sx={{ ml:1 }}/>
        </Button>
        <Button
          onClick={handleBestSort}
          variant="contained"
          style={{ 
            textTransform: 'none',
            backgroundColor: sortBestFlag ? orange[500] : "inherit",
            color: sortBestFlag ? "white" : "grey"
          }}
          sx={{ boxShadow: 0 }} 
        >
          Best<WhatshotIcon sx={{ ml:1 }}/>
        </Button>
      </Box>
      <Stack spacing={1} sx={{ mx: 2, mb: 1 }}>
        {postDataArray.map((postData) => {
          return (
            <Post
              key={postData.id}
              pid={postData.id}
              uid={postData.uid}
              title={postData.title}
              body={postData.body}
              upvotes={postData.upvotes - postData.downvotes}
            />
          );
        })}
      </Stack>
      <Pagination count={10} />
    </Box>
  );
};

export default PostList;
