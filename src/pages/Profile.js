import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import TopBar from "../components/Navigation/TopBar";
import Post from "../components/Forum/Post";

import { auth } from "../firebase/users";
import { getUserPosts } from "../firebase/forum";

const Profile = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const getPosts = async (uid) => {
      let posts = await getUserPosts(uid);
      console.log(posts);
      setUserPosts(posts);
    };

    // If we're still authenticating, don't check for a user
    if (loading) return;

    // If we've authenticated and no user is present go back to login
    if (!user) return navigate("/");

    // Get the posts for the user
    getPosts(user.uid);

    //Attempt to fetch user id from the db
    //fetchUserInfo();
  }, [user, loading]);

  return (
    <div>
      <TopBar posting={false} />
      {userPosts.map((post) => {
        return (
          <Post
            key={post.id}
            pid={post.id}
            uid={post.uid}
            title={post.title}
            body={post.body}
            upvotes={post.upvotes - post.downvotes}
          />
        );
      })}
    </div>
  );
};

export default Profile;
