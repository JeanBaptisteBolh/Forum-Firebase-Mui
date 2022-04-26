import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { FcGlobe } from "react-icons/fc";
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SocialLoginButtons from "../components/SocialLoginButtons"
import DividerWithText from "../components/DividerWithText"
import Copyright from "../components/Copyright"

const theme = createTheme();

const SignIn = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={theme}>
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
            <Box component="form" noValidate onSubmit={handleSubmit}>

              {/** GOOGLE/FACEBOOK SIGN IN BUTTONS **/}
              <SocialLoginButtons />

              {/** "OR" DIVIDER **/}
              <DividerWithText>Or</DividerWithText>

              {/**  EMAIL SIGN IN FORM **/}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{ mb: 2 }}
              />
              
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
    </ThemeProvider>
  );
}

export default SignIn;