import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth, logout } from "../firebase/auth";

const Home = () => {
  // Load browser history
  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    // If we're still authenticating, don't check for a user
    if (loading) return;

    // If we've authenticated and no user is present go back to login
    if (!user) return navigate("/");

    //Attempt to fetch user id from the db
    //fetchUserInfo();
  }, [user, loading]);

  return (
    <Box>
      <Button onClick={logout}>Logout</Button>
      <Typography variant="h1">Polyglot Club</Typography>
    </Box>
  );
};

export default Home;
