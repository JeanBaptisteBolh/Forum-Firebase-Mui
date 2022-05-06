import { Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'

const App = () => {
  return (
    <div>
        <CssBaseline/>
        <Routes>
          <Route path="/" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/home" element={<Home/>} />
        </Routes>
    </div>
  );
}

export default App;
