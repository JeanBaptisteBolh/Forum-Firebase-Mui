import { GoogleLoginButton, FacebookLoginButton } from "react-social-login-buttons";

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
      onClick={() => alert("Hello")}
      />
      <FacebookLoginButton 
        style = {{
          margin: 0,
          marginBottom: 16,
          width: "100%",
          fontSize: '1rem',
        }}
        onClick={() => alert("Hello")} 
      />
    </div>
  );
}
              
export default SocialLoginButtons;