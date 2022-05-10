import { useState, useEffect, useId } from "react";

import { Link } from 'react-router-dom';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { grey } from "@mui/material/colors";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { getUserDisplayName } from "../../firebase/auth";

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
    <Link to={`/post/${props.pid}`} style={{ textDecoration: 'none' }}>
      <Card
        variant="outlined"
        sx={{
          border: "2px solid lightgrey",
          borderRadius: 2,
          "&:hover": {
            borderColor: grey[900],
          },
          padding: 1,
        }}
      >
        <Grid container wrap="nowrap" spacing={1}>
          <Grid item>
            <Stack alignItems="center">
              <KeyboardArrowUpIcon/>
              <Typography variant="p" noWrap>{props.upvotes}</Typography>
              <KeyboardArrowDownIcon/>
            </Stack>
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};

export default Post;
