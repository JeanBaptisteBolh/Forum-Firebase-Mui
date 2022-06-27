import { Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import PostFull from './pages/PostFull'


const App = () => {
  return (
    <div>
        <CssBaseline/>
        <Routes>
          <Route path="/" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/home/search/:searchText" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/create-post" element={<CreatePost/>} />
          <Route path="/post/:id" element={<PostFull/>} />
        </Routes>
    </div>
  );
}

export default App;
