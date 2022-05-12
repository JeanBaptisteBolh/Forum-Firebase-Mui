import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";

import TopBar from "../components/TopBar";
import VoteOnPost from "../components/Forum/VoteOnPost"

import { getPostData } from "../firebase/forum";
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
        const postData = await getPostData(pid).catch(console.error);
        setPost(postData);
        setPostLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    const getDisplayName = async (uid) => {
      const userDisplayName = await getUserDisplayName(uid).catch(
        console.error
      );
      setDisplayName(userDisplayName);
    };

    getDisplayName(auth.currentUser.uid);
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
        <Grid container wrap="nowrap">
          {/* Upvote/Downvote Box */}
          <Grid item sx={{ backgroundColor: grey[200], padding: 1}}>
            <VoteOnPost 
              pid={id}
            />
          </Grid>

          {/* Post Title/Body Box */}
          <Grid item sx={{ padding: 1 }}>
            <Typography variant="p" noWrap>{displayName}</Typography>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="p">{post.body}</Typography>
          </Grid>
        </Grid>
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
