import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/users";

import TopBar from "../components/Navigation/TopBar"
import PostList from "../components/Forum/PostList"

const Home = () => {
  // Load browser history
  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);

  const { searchText } = useParams();

  useEffect(() => {
    // If we're still authenticating, don't check for a user
    if (loading) return;

    // If we've authenticated and no user is present go back to login
    if (!user) return navigate("/");

    //Attempt to fetch user id from the db
    //fetchUserInfo();
  }, [user, loading]);

  return (
    <div>
      <TopBar posting={false} />
      <PostList searchText={searchText}/>
    </div>
  );
};

export default Home;
