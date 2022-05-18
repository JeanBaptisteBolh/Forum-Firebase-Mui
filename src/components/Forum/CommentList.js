import { useState, useEffect } from "react";

import { Divider, Grid, Paper, Box } from "@material-ui/core";
import { getCommentIdsForPost } from "../../firebase/forum";
import Comment from "./Comment"

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
      } catch(err) {
        console.error(err);
      }
    }
    
    getCommentIdArray(props.pid);
  }, []);


  return (
    <div style={{}} className="App">
      <Paper>
        <Grid container>
          {commentIdArray.map((cid) => {
            return(
              <Box>
                <Comment
                  key={cid}
                  cid={cid}
                />
                <Divider variant="fullWidth" />
              </Box>
            )
          })}
        </Grid>
      </Paper>
    </div>
  );
};

export default CommentList;