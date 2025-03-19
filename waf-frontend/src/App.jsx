import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from "axios";
import Home from "./pages/Home";
import Comments from "./pages/Comments";

function App() {
  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => setMessage(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/comments" element={<Comments />} />
  </Routes>
</Router>
  );
}

export default App;
