import { useState, useEffect } from "react";

import { Grid, Typography } from "@material-ui/core";
import VoteOnComment from "./VoteOnComment";

import { getUserDisplayName } from "../../firebase/users";
import { getCommentData } from "../../firebase/forum";

const Comment = (props) => {
  const [displayName, setDisplayName] = useState("");
  const [commentData, setCommentData] = useState({});

  useEffect(() => {
    const loadCommentData = async (cid) => {
      const data = await getCommentData(cid);
      setCommentData(data);

      const userDisplayName = await getUserDisplayName(commentData.uid);
      setDisplayName(userDisplayName);

    }

    loadCommentData(props.cid);

  }, []);

  return (
    <Grid container wrap="nowrap" sx={{width:"100%"}}>
      {/* Upvote/Downvote Box */}
      <Grid
        item
        sx={{
          padding: 1,
        }}
      >
        <VoteOnComment cid={props.cid}/>
      </Grid>
      <Grid item>
        <Typography variant="body2">{displayName}</Typography>
        <Typography variant="body2">{commentData.body} </Typography>
        <Typography variant="body2">posted 1 minute ago</Typography>
      </Grid>
    </Grid>
  );
};

export default Comment;
