import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Card from "@mui/material/Card";

import TopBar from "../components/TopBar"

import { getPostData } from "../firebase/forum";

const PostFull = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  
  useEffect(() => {
    const getData = async (pid) => {
      try {
        const postData = await getPostData(pid).catch(console.error);
        setPost(postData);
        setLoading(false);
      } catch(err) {
        console.error(err);
      }
      
    }
    getData(id);

  }, []);

  return !loading ? (
    <div>
      <TopBar posting={false} />
      <Card
        variant="outlined"
        sx={{
          border: "2px solid lightgrey",
          borderRadius: 2,
          padding: 1,
          mx:2,
        }}>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </Card>
    </div>
  ) : (
    <div>
      <TopBar posting={false} />
      <CircularProgress />
    </div>
  );
}

export default PostFull;