import { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from "@mui/material/Typography";

import { 
  updateUserVote, 
  getUserVote,
  updateScore,
  getCommentScore,
} from "../../firebase/forum";

import { orange, blue } from '@mui/material/colors';


const VoteOnComment = (props) => {

  // Upvote/downvote button color toggles
  const [upvote, toggleUpvote] = useState(false);
  const [downvote, toggleDownvote] = useState(false);
  const [votes, setVotes] = useState(0);

  // Upvote/downvote button color styling
  const voteStyles = {
    upvotevotecolor: {
      color: upvote ? orange[500] : "",
    },
    downvotecolor: {
      color: downvote ? blue[500] : "",
    }
  }

  const handleUpvote = async (e) => {
    // Check if user has upvoted post already
    const userVoteForComment = await getUserVote(props.cid, false);

    // If userVoteForPost is undefined, null or false, the user can upvote the post
    if (userVoteForComment == null || userVoteForComment === false ) {
      await updateUserVote(props.cid, true, false);
      await updateScore(props.cid, userVoteForComment, true, false);
      toggleDownvote(false);
      toggleUpvote(true);

    // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      await updateUserVote(props.cid, null, false);
      await updateScore(props.cid, userVoteForComment, null, false);
      toggleUpvote(false);
    }

    const commentScore = await getCommentScore(props.cid);
    setVotes(commentScore);

  };

  const handleDownvote = async (e) => {
    //Check if user has downvoted the post already
    const userVoteForComment = await getUserVote(props.cid, false);

    // If userVoteForPost is undefined, null or true, the user can downvote the post
    if (userVoteForComment == null || userVoteForComment === true ) {
      await updateUserVote(props.cid, false, false);
      await updateScore(props.cid, userVoteForComment, false, false);
      toggleUpvote(false);
      toggleDownvote(true);
    
      // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      await updateUserVote(props.cid, null, false);
      await updateScore(props.cid, userVoteForComment, null, false);
      toggleDownvote(false);
    }

    const commentScore = await getCommentScore(props.cid);
    setVotes(commentScore);
  };

  useEffect(() => {
    // Get the number of votes on the post
    const getVotes = async () => {
      const commentScore = await getCommentScore(props.cid);
      setVotes(commentScore);
    }

    // Get the user's vote for the post
    const getUsersVote = async () => {
      const userVote = await getUserVote(props.cid, false);
      if (userVote === true) {
        toggleUpvote(true);
        toggleDownvote(false);
      } else if (userVote === false) {
        toggleUpvote(false);
        toggleDownvote(true);
      } else {
        toggleUpvote(false);
        toggleDownvote(false);
      }
    }

    getUsersVote();
    getVotes();

  }, []);

  return (
    <Stack alignItems="center">
      <KeyboardArrowUpIcon onClick={handleUpvote} style={voteStyles.upvotevotecolor}/>
        <Typography variant="body2" noWrap>
          {votes}
        </Typography>
      <KeyboardArrowDownIcon onClick={handleDownvote} style={voteStyles.downvotecolor}/>
    </Stack>
  );
};

export default VoteOnComment;
