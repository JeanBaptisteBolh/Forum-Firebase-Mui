import { useState, useEffect } from "react";

import { Typography, Box } from "@mui/material"
import { Button } from "@mui/material";

import VoteOnComment from "./VoteOnComment";
import CreateCommentForm from "./CreateCommentForm";

import { getUserDisplayName } from "../../firebase/users";
import { getCommentData } from "../../firebase/forum";

const Comment = (props) => {
  const [displayName, setDisplayName] = useState("");
  const [commentData, setCommentData] = useState({});
  const [showReplyForm, toggleShowReplyForm] = useState(false);

  useEffect(() => {
    const loadCommentData = async (cid) => {
      const data = await getCommentData(cid);
      const userDisplayName = await getUserDisplayName(data.uid);
      setCommentData(data);
      setDisplayName(userDisplayName);
    };
    loadCommentData(props.cid);
  }, []);

  return (
    <Box
      spacing={0.5}
      sx={{
        mx: 1,
        mb: 1,
        px: 1,
        pt: 1,
        border: "2px solid lightgrey",
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        {displayName} - 1 minute ago
      </Typography>
      <Typography variant="body2" sx={{ mx: 2, mb: 1 }}>{commentData.body}</Typography>
      <Box alignItems="center" sx={{ display: "flex" }}>
        <VoteOnComment cid={props.cid} />
        <Button 
          size="small" 
          sx={{ textTransform: "none", p: 0 }} 
          onClick={() => {toggleShowReplyForm(!showReplyForm)}}
        >
          Reply
        </Button>
      </Box>
      
      { showReplyForm && 
        <Box sx={{ mt: 1 }}>
          <CreateCommentForm parentId={props.cid} commentIsForPost={false}/>
        </Box>
      }
      
    { (props.children.length !== 0) &&
      props.children.map(comment => {
        console.log(comment)
        return (
          <Comment 
            key={comment.cid}
            cid={comment.cid}
            created={comment.created}
            depth={comment.depth}
            children={comment.children}
          />
        )
      })

    }


    </Box>


  );
};

export default Comment;
