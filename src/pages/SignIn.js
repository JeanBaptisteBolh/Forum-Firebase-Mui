import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm, Controller } from "react-hook-form";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { FcGlobe } from "react-icons/fc";
import Typography from '@mui/material/Typography';
import SocialLoginButtons from "../components/SocialLoginButtons"
import DividerWithText from "../components/DividerWithText"
import Copyright from "../components/Copyright"

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  auth,
  loginEmailPassword,
} from "../firebase/auth";

const SignIn = () => {
  // Load browser history
  const navigate = useNavigate();
  
  const [signInSuccessMsg, setSignInSuccessMsg] = useState("");

  // Get authentication variables
  const [user, loading, error] = useAuthState(auth);

  // react-hook-form
  const {control, handleSubmit, formState: { errors }} = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    const result = await loginEmailPassword(data.email, data.password);
    if (!result) {
      setSignInSuccessMsg("Invalid Email/Password");
    }
  }

  // Reroute user to the home page if already signed in
  useEffect(() => {
    // Possibly add a loading screen
    if (loading) return;
    if (user) navigate("/home");
  }, [user, loading]);

  return (
    <Grid container component="main">
      <CssBaseline />

      {/** IMAGES **/}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/** LOGIN **/}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/** ICON AND WELCOME MESSAGE **/}
          <FcGlobe size={50}/>
          <Typography component="h1" variant="h5" sx = {{ mt: 1, mb: 4 }}>
            Welcome Back!
          </Typography>

          {/** SIGN IN FORM **/}
          <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
          >

            {/** GOOGLE/FACEBOOK SIGN IN BUTTONS **/}
            <SocialLoginButtons />

            {/** "OR" DIVIDER **/}
            <DividerWithText>Or</DividerWithText>

            {/**  EMAIL SIGN IN FORM **/}
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  onChange={onChange}
                  value={value}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  name="email"
                  autoComplete="email"
                  sx={{ mt: 2, mb: 2 }}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  onChange={onChange}
                  value={value}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  sx={{ mb: 2 }}
                />
              )}
            />


            {/** FORM SEND SUCCESS MESSAGE **/}
            {signInSuccessMsg.length > 0 && (
              <Typography
                variant="body2"
                sx={{ mb: 1 }}
                color = "red"
              >
                {signInSuccessMsg}
              </Typography>
            )}
            
            {/** Remember me checkbox **/}
            {/** *
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            */}


            <Grid container sx={{ mb: 2 }}>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 4 }}
            >
              Sign In
            </Button>
            <Copyright />

          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignIn;