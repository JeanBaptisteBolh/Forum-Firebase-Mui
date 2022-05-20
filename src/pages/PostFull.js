import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { CircularProgress, Card, Grid, Typography, Box } from "@mui/material";

import TopBar from "../components/TopBar";
import VoteOnPost from "../components/Forum/VoteOnPost"
import CommentList from "../components/Forum/CommentList"
import CreateCommentForm from "../components/Forum/CreateCommentForm"

import { getPostData, getCommentsObject } from "../firebase/forum";
import { auth, getUserDisplayName } from "../firebase/users";

const PostFull = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const { id } = useParams();
  const [postLoading, setPostLoading] = useState(true);
  const [post, setPost] = useState({});
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const getData = async (pid) => {
      try {
        const commentChildrenData = await getCommentsObject(pid);
        console.log("COMMENT CHILDREN DATA \n" + JSON.stringify(commentChildrenData));
        const postData = await getPostData(pid).catch(console.error);
        const userDisplayName = await getUserDisplayName(postData.uid);
        setPost(postData);
        setDisplayName(userDisplayName);
        setPostLoading(false);
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
          <Grid item sx={{ 
            padding: 1
          }}>
            <VoteOnPost 
              pid={id}
            />
          </Grid>

          {/* Post Title/Body Box */}
          <Grid item sx={{ padding: 1 }}>
            <Typography variant="body2" noWrap>{displayName}</Typography>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2">{post.body}</Typography>
          </Grid>
        </Grid>
        
        {/* Form to leave a comment */}
        <Box sx={{ mx: 2, my: 1 }}>
          <CreateCommentForm parentId={id} commentIsForPost={true}/>
        </Box>

        {/* Comment List */}
        <CommentList pid={id}/>
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
