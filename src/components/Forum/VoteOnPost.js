import Stack from "@mui/material/Stack";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from "@mui/material/Typography";

import { updateVotePost, getUserVoteForPost } from "../../firebase/forum";


// TODO: UPDATE VOTE COUNT FOR THE POST, ALSO UNDOING VOTE IS NOT WORKING

const VoteOnPost = (props) => {
  const handleUpvote = async (e) => {
    // Check if user has upvoted post already
    const userVoteForPost = await getUserVoteForPost(props.pid);

    console.log(userVoteForPost)
    // If userVoteForPost is undefined, null or false, the user can upvote the post
    if (userVoteForPost == null || userVoteForPost === false ) {
      console.log("Voting true");
      updateVotePost(props.pid, true);
    // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      console.log("Voting null");
      updateVotePost(props.pid, null);
    }

  };

  const handleDownvote = async (e) => {
    //Check if user has downvoted the post already
    const userVoteForPost = await getUserVoteForPost(props.pid);

    console.log(userVoteForPost)
    // If userVoteForPost is undefined, null or false, the user can upvote the post
    if (userVoteForPost == null || userVoteForPost === false ) {
      console.log("Voting false");
      updateVotePost(props.pid, false);
    // Otherwise the user has already upvoted the post so we should undo their upvote
    } else {
      console.log("Voting null");
      updateVotePost(props.pid, null);
    }
  };

  return (
    <Stack alignItems="center">
      <KeyboardArrowUpIcon onClick={handleUpvote} />
        <Typography variant="p" noWrap>
          {props.upvotes}
        </Typography>
      <KeyboardArrowDownIcon onClick={handleDownvote} />
    </Stack>
  );
};

export default VoteOnPost;
