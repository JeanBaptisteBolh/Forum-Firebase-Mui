import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  Typography,
  Fade,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material";

import TopBar from "../components/Navigation/TopBar";
import Post from "../components/Forum/Post";
import Comment from "../components/Forum/Comment";

import { auth } from "../firebase/users";
import { getUserPosts, getUserComments } from "../firebase/forum";

const Profile = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [showPosts, setShowPosts] = useState(true);
  // const [showComments, setShowComments] = useState(false);
  // const [alignment, setAlignment] = useState('posts');

  // const handleChange = (event, newAlignment) => {
  //   setAlignment(newAlignment);
  //   if (newAlignment === 'posts') {
  //     setShowComments(false);
  //     setShowPosts(true);
  //   } else {
  //     setShowComments(true);
  //     setShowPosts(false);
  //   }
  // };

  useEffect(() => {
    const getPosts = async (uid) => {
      const posts = await getUserPosts(uid);
      setUserPosts(posts);
    };
    // const getComments = async (uid) => {
    //   const comments = await getUserComments(uid);
    //   setUserComments(comments);
    // }

    // If we're still authenticating, don't check for a user
    if (loading) return;

    // If we've authenticated and no user is present go back to login
    if (!user) return navigate("/");

    // Get the posts for the user
    getPosts(user.uid);
    // getComments(user.uid);

    //Attempt to fetch user id from the db
    //fetchUserInfo();
  }, [user, loading]);

  return (
    <div>
      <TopBar posting={false} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "medium" }}>
          My Posts
        </Typography>

        {/* <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="posts">Posts</ToggleButton>
            <ToggleButton value="comments">Comments</ToggleButton>
          </ToggleButtonGroup> */}

        <Box sx={{ display: "flex" }}>
          <Fade in={showPosts}>
            <Stack spacing={1} sx={{ mx: 2, mb: 1 }}>
              {userPosts.map((post) => {
                return (
                  <Post
                    key={post.id}
                    pid={post.id}
                    uid={post.uid}
                    title={post.title}
                    body={post.body}
                    upvotes={post.upvotes - post.downvotes}
                  />
                );
              })}
            </Stack>
          </Fade>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
