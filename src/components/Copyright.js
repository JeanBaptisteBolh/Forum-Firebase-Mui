import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

const Copyright = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} sx = {{mb: 2}}>
      {'Copyright © '}
      <Link to={{ pathname: "https://mui.com/" }} target="_blank">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;