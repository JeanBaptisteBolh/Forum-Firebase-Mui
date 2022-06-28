import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

const Copyright = (props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} sx = {{mb: 2}}>
      {'Copyright © '}
      <Link to={{ pathname: "https://vidalingua.com/" }} target="_blank">
        Vidalingua
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;