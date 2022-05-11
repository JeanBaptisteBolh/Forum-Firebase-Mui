import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { auth } from "../firebase/users";
import { createPost } from "../firebase/forum";

import TopBar from "../components/TopBar";
import CreatePostForm from "../components/Forum/CreatePostForm"

const CreatePost = () => {
  // Load browser history
  const navigate = useNavigate();

  const [postSuccessMsg, setPostSuccessMsg] = useState("");

  // Get authentication variables
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    // If we're still authenticating, don't check for a user
    if (loading) return;

    // If we've authenticated and no user is present go back to login
    if (!user) return navigate("/");

    //Attempt to fetch user id from the db
    //fetchUserInfo();
  }, [user, loading]);

  return (
    <Box>
      <TopBar posting={true} />
      <Box sx={{ mx: 2 }}>
        {/** PAGE TITLE **/}
        <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
          Create Post
        </Typography>
        <CreatePostForm />
      </Box>
    </Box>
  );
};

export default CreatePost;
