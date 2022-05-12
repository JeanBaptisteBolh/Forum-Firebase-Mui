import { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from "@mui/material/Typography";

import { 
  updateUserVoteForPost, 
  getUserVoteForPost,
  updatePostScore,
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
    const userVoteForPost = await getUserVoteForPost(props.pid);

    console.log(userVoteForPost)
    // If userVoteForPost is undefined, null or false, the user can upvote the post
    if (userVoteForPost == null || userVoteForPost === false ) {
      updateUserVoteForPost(props.pid, true);
      updatePostScore(props.pid, userVoteForPost, true);
      toggleDownvote(false);
      toggleUpvote(true);

    // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      console.log("Voting null");
      updateUserVoteForPost(props.pid, null);
      updatePostScore(props.pid, userVoteForPost, null);
      toggleUpvote(false);
    }

  };

  const handleDownvote = async (e) => {
    //Check if user has downvoted the post already
    const userVoteForPost = await getUserVoteForPost(props.pid);

    console.log(userVoteForPost)
    // If userVoteForPost is undefined, null or true, the user can downvote the post
    if (userVoteForPost == null || userVoteForPost === true ) {
      updateUserVoteForPost(props.pid, false);
      updatePostScore(props.pid, userVoteForPost, false);
      toggleUpvote(false);
      toggleDownvote(true);
    
      // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      updateUserVoteForPost(props.pid, null);
      updatePostScore(props.pid, userVoteForPost, null);
      toggleDownvote(false);
    }
  };

  useEffect(() => {
    // Get the number of votes on the post
    const getVotes = async () => {
      const postScore = await getPostScore(props.pid);
      setVotes(postScore);
    }

    // Get the user's vote for the post
    const getUsersVote = async () => {
      const userVote = await getUserVoteForPost(props.pid);
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

  });

  return (
    <Stack alignItems="center">
      <KeyboardArrowUpIcon onClick={handleUpvote} style={voteStyles.upvotevotecolor}/>
        <Typography variant="p" noWrap>
          {votes}
        </Typography>
      <KeyboardArrowDownIcon onClick={handleDownvote} style={voteStyles.downvotecolor}/>
    </Stack>
  );
};

export default VoteOnPost;
