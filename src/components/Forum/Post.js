import { useState, useEffect, useId } from "react";

import { Link } from 'react-router-dom';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { grey } from "@mui/material/colors";

import { getUserDisplayName } from "../../firebase/users";

import VoteOnPost from "./VoteOnPost";

/* Post as viewed on the home page.  Child of PostList.js */
const Post = (props) => {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const getDisplayName = async (uid) => {
      const userDisplayName = await getUserDisplayName(uid).catch(console.error);
      setDisplayName(userDisplayName);
    }
    getDisplayName(props.uid);

  }, []);

  return (
      <Card
        variant="outlined"
        sx={{
          border: "2px solid lightgrey",
          borderRadius: 2,
          "&:hover": {
            borderColor: grey[900],
          },
        }}
      >
        <Grid container wrap="nowrap">

          {/* Upvote/Downvote Box */}
          <Grid item sx={{ backgroundColor: grey[200], padding: 1}}>
            <VoteOnPost 
              pid={props.pid}
            />
          </Grid>

          {/* Post Title/Body Box */}
          <Grid item sx={{ padding: 1 }}>
            <Link to={`/post/${props.pid}`} style={{ textDecoration: 'none' }}>
              <Typography variant="p" noWrap>{displayName}</Typography>
              <Typography variant="h5">{props.title}</Typography>
              <Typography
                variant="p"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {props.body}
              </Typography>
            </Link>
          </Grid>

        </Grid>
        
      </Card>
  );
};

export default Post;
