import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { FcGlobe } from "react-icons/fc";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DividerWithText from "../components/DividerWithText"
import SocialLoginButtons from "../components/SocialLoginButtons"
import Copyright from "../components/Copyright"

const theme = createTheme();

const SignUp = () => {
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          {/** ICON AND WELCOME MESSAGE **/}
          <FcGlobe size={50}/>
          <Typography component="h1" variant="h5" sx = {{ mt: 1, mb: 4 }}>
            Sign up
          </Typography>
          
          {/**  SIGN UP FORM **/}
          <Box component="form" noValidate onSubmit={handleSubmit}>

            {/** GOOGLE/FACEBOOK SIGN IN BUTTONS **/}
            <SocialLoginButtons />

            {/** "OR" DIVIDER **/}
            <DividerWithText>Or</DividerWithText>

            {/**  EMAIL SIGN UP FORM **/}
            <Grid container spacing={2} sx = {{mt: 0.1}} >
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {/** EMAIL UPDATES CHECKBOX
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
               */}

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end"  sx={{ mb: 2 }} >
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright/>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;