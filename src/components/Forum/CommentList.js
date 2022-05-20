import { useState, useEffect } from "react";

import { Divider, Box } from "@material-ui/core";
import { getCommentIdsForPost } from "../../firebase/forum";
import Comment from "./Comment";
import { Stack } from "@mui/material";

const CommentList = (props) => {
  const [commentIdArray, setCommentIdArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCommentIdArray = async (pid) => {
      try {
        // Get the comments object for the post
        const commentIds = await getCommentIdsForPost(pid);
        setCommentIdArray(commentIds);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    getCommentIdArray(props.pid);
  }, []);

  return (
    <Stack>
      {commentIdArray.map((cid) => {
        return (
          <Comment key={cid} cid={cid} />
        );
      })}
    </Stack>
  );
};

export default CommentList;
