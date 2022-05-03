import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm, Controller } from "react-hook-form";

// Material UI imports
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { FcGlobe } from "react-icons/fc";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// Component imports
import DividerWithText from "../components/DividerWithText";
import SocialLoginButtons from "../components/SocialLoginButtons";
import Copyright from "../components/Copyright";

// Firebase imports
import {
  auth,
  createUserEmailPassword,
} from "../firebase/auth";

const SignUp = () => {
  // Load browser history
  const navigate = useNavigate();

  // Get authentication variables
  const [user, loading, error] = useAuthState(auth);

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [firstname, setFirstname] = useState("");
  // const [lastname, setLastname] = useState("");

  // react-hook-form
  const {control, handleSubmit, formState: { errors }} = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSignUp = (data) => {
    createUserEmailPassword(
      data.firstName, 
      data.lastName, 
      data.email, 
      data.password
    );
  };

  useEffect(() => {
    if (loading) return;
    //If a user is logged in, go to the editor page
    if (user) navigate("/home");
  }, [user, loading]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
          Sign up
        </Typography>

        {/**  SIGN UP FORM **/}
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSignUp)}
        >
          {/** GOOGLE/FACEBOOK SIGN IN BUTTONS **/}
          <SocialLoginButtons />

          {/** "OR" DIVIDER **/}
          <DividerWithText>Or</DividerWithText>

          {/**  EMAIL SIGN UP FORM **/}
          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            
            {/** FIRST NAME FIELD **/}
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "Please enter your first name" }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    onChange={onChange}
                    value={value}
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                )}
              />
            </Grid>
            
            {/** LAST NAME FIELD **/}
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Please enter your last name" }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    onChange={onChange}
                    value={value}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                )}
              />
            </Grid>
            
            {/** EMAIL FIELD **/}
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{ required: "Please enter your email" }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    onChange={onChange}
                    value={value}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                )}
              />
            </Grid>
            
            {/** PASSWORD NAME FIELD **/}
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Please enter your password" }}
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

          <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
};

export default SignUp;
