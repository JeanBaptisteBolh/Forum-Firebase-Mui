import { Typography, Box, Button } from "@mui/material";
import VoteOnComment from "./VoteOnComment";

const NewReply = (props) => {
  return (
    <Box sx={{ mt:1 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {props.displayName} - 1 minute ago
      </Typography>
      <Box
        spacing={0.5}
        sx={{
          ml: 1,
          pl: 1,
          borderLeft: "2px solid lightgrey",
        }}
      >
        <Typography variant="body2" sx={{ mx: 1, mb: 0.5 }}>
          {props.body}
        </Typography>

        <Box alignItems="center" sx={{ display: "flex" }}>
          <VoteOnComment cid={props.cid} />
        </Box>
      </Box>
    </Box>
  );
};

export default NewReply;
