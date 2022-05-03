import { GoogleLoginButton, FacebookLoginButton } from "react-social-login-buttons";
// Firebase imports
import { loginGoogle } from "../firebase/auth";

const SocialLoginButtons = () => {
  return (
    <div>
      {/** GOOGLE/FACEBOOK SIGN IN BUTTONS **/}
      {/** css styles necessary because these stupid buttons come with some margin styling **/}
      <GoogleLoginButton 
        style = {{ 
          margin: 0, 
          marginBottom: 16, 
          width: '100%',
          fontSize: '1rem',
        }}
      onClick={() => loginGoogle()}
      />
      <FacebookLoginButton 
        style = {{
          margin: 0,
          marginBottom: 16,
          width: "100%",
          fontSize: '1rem',
        }}
        onClick={() => alert("Facebook login button pressed")} 
      />
    </div>
  );
}
              
export default SocialLoginButtons;