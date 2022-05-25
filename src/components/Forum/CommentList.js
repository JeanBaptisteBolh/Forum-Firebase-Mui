import { useState, useEffect } from "react";

import { getCommentsArr } from "../../firebase/forum";
import Comment from "./Comment";
import { Stack } from "@mui/material";

const CommentList = (props) => {
  const [commentDataArr, setCommentDataArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCommentData = async (pid) => {
      try {
        // Get the comments object for the post
        const commentsArr = await getCommentsArr(pid);
        setCommentDataArr(commentsArr);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    getCommentData(props.pid);
  }, []);

  return (
    <Stack>
      {
        commentDataArr.map(comment => {
          return (
            <Comment 
              key={comment.cid}
              cid={comment.cid}
              created={comment.created}
              depth={comment.depth}
              children={comment.children}
            />
          );
        })
      }
    </Stack>
  );
};

export default CommentList;
