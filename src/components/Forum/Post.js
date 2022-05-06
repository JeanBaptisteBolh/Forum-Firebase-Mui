import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { grey, black } from '@mui/material/colors';

const Post = (props) => {

  return (
    <div>
      <Card variant="outlined" sx={{
        border: '2px solid lightgrey',
        borderRadius: 2,
        "&:hover": {
          borderColor: grey[900],
        },
        padding: 1
      }}>
        <Typography variant="h5">{props.title}</Typography>
        <Typography variant="p">{props.body}</Typography>
      </Card>
    </div>
  );
}

export default Post;