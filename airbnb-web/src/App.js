import React, { useState, useEffect } from "react";
import { Navbar, Hotels } from "./components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchHotels } from './actions/hotel';

const App = () => {
  // Setting Dispatch
  const dispatch = useDispatch();

  // Using State
  const [hotels, setHotels] = useState([]);

  // Initial Fetch
  useEffect(() => { 
    dispatch(fetchHotels(setHotels))
  }, []);

  // Building Layout
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Hotels hotels={hotels}/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
