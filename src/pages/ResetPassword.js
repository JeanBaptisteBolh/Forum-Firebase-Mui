import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { auth, sendPassResetEmail } from "../firebase/users";

import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { FcGlobe } from "react-icons/fc";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);

  // Load browser history
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) return navigate("/home");
  }, [user, loading]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/** ICON AND WELCOME MESSAGE **/}
        <FcGlobe size={50} />
        <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 4 }}>
          Reset Password
        </Typography>

        {/**  SIGN UP FORM **/}
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          fullWidth
          id="email"
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => sendPassResetEmail(email)}
        >
          Send password reset email
        </Button>
        <div>
          <Link to="/signup">Sign Up</Link>
        </div>
      </Box>
    </Container>
  );
}
export default ResetPassword;
