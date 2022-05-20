import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { TextField, Box, Button } from "@mui/material";

import { commentOnPost, commentOnComment } from "../../firebase/forum";

const CreateCommentForm = (props) => {
  // If successful, we should get the comment and place it at the top of the comments
  const [commentSuccessMsg, setCommentSuccessMsg] = useState("");

  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  // Handler for create comment submission
  const onSubmit = async (data) => {
    let result;
    if (props.commentIsForPost) {
      result = await commentOnPost(props.parentId, data.comment);
    } else {
      console.log("doing it")
      result = await commentOnComment(props.parentId, data.comment);
    }

    if (!result) {
      setCommentSuccessMsg("Error creating post");
    } else {
      setCommentSuccessMsg("Success");
    }
  };
  const onError = () => {
    setCommentSuccessMsg("Error");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
      <Controller
        name="comment"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChange={onChange}
            value={value}
            required
            id="comment"
            label="Leave a comment"
            name="comment"
            multiline
            rows={4}
            size="small"
            sx={{ width: "100%" }}
            // 0.875 == body2 in material ui
            InputProps={{style: {fontSize: "0.875rem"}}}
            InputLabelProps={{style: {fontSize: "0.875rem"}}}
          />
        )}
      />
      <Button type="submit" size="small" sx={{ textTransform: "none" }}>Comment</Button>
    </Box>
  );
};

export default CreateCommentForm;
