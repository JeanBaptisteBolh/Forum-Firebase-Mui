import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  CircularProgress,
  Card,
  Grid,
  Typography,
  Box,
} from "@mui/material";

import TopBar from "../components/Navigation/TopBar";
import VoteOnPost from "../components/Forum/VoteOnPost";
import CommentList from "../components/Forum/CommentList";
import CreateCommentForm from "../components/Forum/CreateCommentForm";
import NewReply from "../components/Forum/NewReply";
import PostDeleteButton from "../components/Forum/PostDeleteButton";

import { getPostData, deletePost, commentOnPost } from "../firebase/forum";
import { auth, getUserDisplayName } from "../firebase/users";

const PostFull = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const { id } = useParams();
  const [postLoading, setPostLoading] = useState(true);
  const [post, setPost] = useState({});
  const [displayName, setDisplayName] = useState("");

  // If the logged in user created the post, this should be true.  (used to display edit/delete options)
  const [userCreatedPost, setUserCreatedPost] = useState(false);

  // If true, show the reply form below the post
  const [showReplyForm, toggleShowReplyForm] = useState(true);

  // Show the dialogue box for confirmation of desire to delete post
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);

  // Controls reply submission loading wheel while
  const [replySubmissionLoading, setReplySumbissionLoading] = useState(false);

  // Used to show the new reply
  const [replyId, setReplyId] = useState({});
  const [reply, setReply] = useState({});
  const [replied, setReplied] = useState(false);

  // Handler for create comment submission
  const onCommentSubmit = async (data) => {
    toggleShowReplyForm(false);
    setReplySumbissionLoading(true);
    const [newCommentId, newCommentData] = await commentOnPost(
      id,
      data.comment
    );

    if (!newCommentData) {
      // TODO: Show error box for comment
      toggleShowReplyForm(true);
    } else {
      setReplyId(newCommentId);
      setReply(newCommentData);
      setReplySumbissionLoading(false); // Stop showing loading wheel
      setReplied(true); // We successfully replied to the comment
    }
  };

  // Post deletion handler
  const handlePostDelete = async () => {
    // Delete the post
    await deletePost(id);

    navigate("/home");
  };

  const showPostDeleteDialogue = () => {
    setShowDeletionDialogue(true);
  };

  const hidePostDeleteDialogue = () => {
    setShowDeletionDialogue(false);
  };

  useEffect(() => {
    const getData = async (pid) => {
      try {
        const postData = await getPostData(pid).catch(console.error);
        const userDisplayName = await getUserDisplayName(postData.uid);

        setPost(postData);
        setDisplayName(userDisplayName);
        setPostLoading(false);

        if (auth.currentUser.uid === postData.uid) {
          setUserCreatedPost(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getData(id);
  }, []);

  useEffect(() => {
    // If we're still authenticating, don't check for a user
    if (loading) return;

    // If we've authenticated and no user is present go back to login
    if (!user) return navigate("/");

    //Attempt to fetch user id from the db
    //fetchUserInfo();
  }, [user, loading]);

  return !postLoading ? (
    <div>
      <TopBar posting={false} />
      <Card
        variant="outlined"
        sx={{
          border: "2px solid lightgrey",
          borderRadius: 2,
          mx: 2,
        }}
      >
        {/* Contains the post info */}
        <Grid container wrap="nowrap">
          {/* Upvote/Downvote Box */}
          <Grid
            item
            sx={{
              padding: 1,
            }}
          >
            <VoteOnPost pid={id} />
          </Grid>

          {/* Post Title/Body Box */}
          <Grid item sx={{ padding: 1 }}>
            <Typography variant="body2" noWrap>
              {displayName}
            </Typography>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2">{post.body}</Typography>
            {userCreatedPost && (
              <PostDeleteButton pid={id} />
            )}
          </Grid>
        </Grid>

        {/********** Form to leave a comment **********/}
        {showReplyForm && (
          <Box sx={{ mx: 2, my: 1 }}>
            <CreateCommentForm onSubmit={onCommentSubmit} />
          </Box>
        )}

        {/********** Waiting for reply submission result wheel **********/}
        {replySubmissionLoading && <CircularProgress />}

        {/********** Display the new reply **********/}
        {replied && (
          <Box sx={{ ml: 1 }}>
            <NewReply
              cid={replyId}
              displayName={displayName}
              depth={reply.depth}
              body={reply.body}
            />
          </Box>
        )}

        {/********** Comment List **********/}
        <CommentList pid={id} />

      </Card>
    </div>
  ) : (
    <div>
      <TopBar posting={false} />
      <CircularProgress />
    </div>
  );
};

export default PostFull;
