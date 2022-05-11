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

import { auth } from "../../firebase/users";
import { createPost } from "../../firebase/forum";

import TopBar from "../TopBar";

const CreatePostForm = () => {
  // Load browser history
  const navigate = useNavigate();

  const [postSuccessMsg, setPostSuccessMsg] = useState("");

  // Get authentication variables
  const [user, loading, error] = useAuthState(auth);

  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
  });

  // Handler for create post submission
  const onSubmit = async (data) => {
    // TODO: Check if user has posted in the last 10 minutes
    // const hasPosted = await hasUserPostedRecently()
    console.log("Triggered");
    const result = await createPost(data.title, data.body);
    if (!result) {
      setPostSuccessMsg("Error creating post");
    } else {
      navigate("/home");
    }
  };
  const onError = () => {
    setPostSuccessMsg("Error");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
      <Grid container spacing={2} sx={{ mt: 0.1 }}>
        {/** EMAIL FIELD **/}
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
              />
            )}
          />
        </Grid>

        {/** PASSWORD NAME FIELD **/}
        <Grid item xs={12}>
          <Controller
            name="body"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value}
                required
                fullWidth
                name="body"
                label="Body"
                id="body"
                autoComplete="body"
              />
            )}
          />
        </Grid>

        {/** FORM SEND SUCCESS MESSAGE **/}
        {postSuccessMsg.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="red">
              {postSuccessMsg}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
        Post
      </Button>
    </Box>
  );
};

export default CreatePostForm;
