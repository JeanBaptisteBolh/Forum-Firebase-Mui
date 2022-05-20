import { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from "@mui/material/Typography";

import { 
  updateUserVote, 
  getUserVote,
  updateScore,
  getPostScore,
} from "../../firebase/forum";

import { orange, blue } from '@mui/material/colors';


const VoteOnPost = (props) => {

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
    const userVoteForPost = await getUserVote(props.pid, true);

    // If userVoteForPost is undefined, null or false, the user can upvote the post
    if (userVoteForPost == null || userVoteForPost === false ) {
      await updateUserVote(props.pid, true, true);
      await updateScore(props.pid, userVoteForPost, true, true);
      toggleDownvote(false);
      toggleUpvote(true);

    // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      await updateUserVote(props.pid, null, true);
      await updateScore(props.pid, userVoteForPost, null, true);
      toggleUpvote(false);
    }

    const postScore = await getPostScore(props.pid);
    setVotes(postScore);

  };

  const handleDownvote = async (e) => {
    //Check if user has downvoted the post already
    const userVoteForPost = await getUserVote(props.pid, true);

    // If userVoteForPost is undefined, null or true, the user can downvote the post
    if (userVoteForPost == null || userVoteForPost === true ) {
      await updateUserVote(props.pid, false, true);
      await updateScore(props.pid, userVoteForPost, false, true);
      toggleUpvote(false);
      toggleDownvote(true);
    
      // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      await updateUserVote(props.pid, null, true);
      await updateScore(props.pid, userVoteForPost, null, true);
      toggleDownvote(false);
    }

    const postScore = await getPostScore(props.pid);
    setVotes(postScore);
  };

  useEffect(() => {
    // Get the number of votes on the post
    const getVotes = async () => {
      const postScore = await getPostScore(props.pid);
      setVotes(postScore);
    }

    // Get the user's vote for the post
    const getUsersVote = async () => {
      const userVote = await getUserVote(props.pid, true);
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
      <Typography variant="body2" noWrap>{votes}</Typography>
      <KeyboardArrowDownIcon onClick={handleDownvote} style={voteStyles.downvotecolor}/>
    </Stack>
  );
};

export default VoteOnPost;
