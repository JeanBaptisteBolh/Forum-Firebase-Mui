import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Typography, Dialog, Grid } from "@mui/material";

import { deletePost } from "../../firebase/forum";

const PostDeleteButton = (props) => {
  const navigate = useNavigate();

  // Show the dialogue box for confirmation of desire to delete post
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);

  // Post deletion handler
  const handlePostDelete = async () => {
    // Delete the post
    await deletePost(props.pid);

    navigate("/home");
  };

  const showPostDeleteDialogue = () => {
    setShowDeletionDialogue(true);
  };

  const hidePostDeleteDialogue = () => {
    setShowDeletionDialogue(false);
  };

  return (
    <div>
      <Button
        size="small"
        sx={{ textTransform: "none", p: 0, mt: 1 }}
        color="error"
        onClick={() => {
          showPostDeleteDialogue();
        }}
      >
        Delete post
      </Button>

      {/********** Post deletion confirmation dialogue **********/}
      <Dialog open={showDeletionDialogue} onClose={hidePostDeleteDialogue}>
        <Typography sx={{ m: 2 }}>
          Are you sure you want to delete this post?
        </Typography>
        <Grid
          container
          alignItems="right"
          justifyContent="right"
          sx={{ mb: 2 }}
        >
          <Grid item>
            <Button
              sx={{ textTransform: "none", p: 0 }}
              onClick={hidePostDeleteDialogue}
            >
              Close
            </Button>
          </Grid>
          <Grid item>
            <Button
              sx={{ textTransform: "none", p: 0 }}
              color="error"
              onClick={handlePostDelete}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default PostDeleteButton;
