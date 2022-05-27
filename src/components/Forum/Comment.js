import { useState, useEffect } from "react";

import { Typography, Box, Button, CircularProgress } from "@mui/material";

import VoteOnComment from "./VoteOnComment";
import CreateCommentForm from "./CreateCommentForm";
import NewReply from "./NewReply";

import { getUserDisplayName, auth } from "../../firebase/users";
import {
  getCommentData,
  commentOnComment,
  deleteCommentInLiveThread,
} from "../../firebase/forum";

const Comment = (props) => {
  // The author of the comment's display name (first and last name)
  const [displayName, setDisplayName] = useState("");

  // Object containing comment data from firestore.
  const [commentData, setCommentData] = useState({});

  // If true, show the reply form below the comment
  const [showReplyForm, toggleShowReplyForm] = useState(false);

  // If the logged in user created the comment, this should be true.  (used to display edit/delete options)
  const [userCreatedComment, setUserCreatedComment] = useState(false);

  // Controls reply submission loading wheel while
  const [replySubmissionLoading, setReplySumbissionLoading] = useState(false);

  // Used to show the new reply
  const [replyId, setReplyId] = useState({});
  const [reply, setReply] = useState({});
  const [replied, setReplied] = useState(false);

  // Comment deletion handler
  const onDelete = async () => {
    // Delete the comment
    await deleteCommentInLiveThread(props.cid);

    // Update the comment data to reload the component and reflect changes.
    const data = await getCommentData(props.cid);
    setCommentData(data);
  };

  // Handler for create comment submission
  const onCommentSubmit = async (data) => {
    toggleShowReplyForm(false);
    setReplySumbissionLoading(true);
    const [newCommentId, newCommentData] = await commentOnComment(
      props.cid,
      data.comment
    );

    if (!newCommentData) {
      // TODO: Show error box for comment
      toggleShowReplyForm(true); // Reshow the comment reply form
    } else {
      setReplyId(newCommentId);
      setReply(newCommentData);
      setReplySumbissionLoading(false); // Stop showing loading wheel
      setReplied(true); // We successfully replied to the comment
    }
  };

  useEffect(() => {
    const loadCommentData = async (cid) => {
      const data = await getCommentData(cid);
      const userDisplayName = await getUserDisplayName(data.uid);
      setCommentData(data);
      setDisplayName(userDisplayName);

      if (auth.currentUser.uid === data.uid) {
        setUserCreatedComment(true);
      }
    };
    loadCommentData(props.cid);
  }, []);

  return (
    <Box sx={{ mb:1 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {displayName} - 1 minute ago
      </Typography>
      <Box
        sx={{
          ml: 1,
          pl: 1,
          borderLeft: "2px solid lightgrey",
        }}
      >
        {!commentData.deleted && (
          <Typography variant="body2" sx={{ mx:1, mb:0.5 }}>
            {commentData.body}
          </Typography>
        )}
        {commentData.deleted && (
          <Typography
            variant="body2"
            sx={{  mx:1, mb:0.5, fontStyle: "italic" }}
          >
            [deleted]
          </Typography>
        )}

        <Box alignItems="center" sx={{ display: "flex" }}>
          <VoteOnComment cid={props.cid} />
          <Button
            size="small"
            sx={{ textTransform: "none", p: 0 }}
            onClick={() => {
              toggleShowReplyForm(!showReplyForm);
            }}
          >
            Reply
          </Button>
          {userCreatedComment && !commentData.deleted && (
            <Button
              size="small"
              sx={{ textTransform: "none", p: 0 }}
              color="error"
              onClick={() => {
                onDelete();
              }}
            >
              Delete
            </Button>
          )}
        </Box>

        {/********** Reply to comment form **********/}
        {showReplyForm && (
          <Box marginLeft={5}>
            <CreateCommentForm onSubmit={onCommentSubmit} />
          </Box>
        )}

        {/********** Waiting for reply submission result wheel **********/}
        {replySubmissionLoading && <CircularProgress />}

        {/********** Display the new reply **********/}
        {replied && (
          <NewReply
            cid={replyId}
            displayName={displayName}
            depth={reply.depth}
            body={reply.body}
          />
        )}

        {/********** Child comments **********/}
        {props.children.length !== 0 &&
          props.children.map((comment) => {
            return (
              <Comment
                key={comment.cid}
                cid={comment.cid}
                parentId={props.cid}
                commentIsForPost={false}
                created={comment.created}
                depth={comment.depth}
                children={comment.children}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export default Comment;
