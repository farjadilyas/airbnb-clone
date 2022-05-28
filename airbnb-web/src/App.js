import React, { useState, useEffect } from "react";
import { Navbar, Hotels, Auth, Bookings, HotelDetails, Payment } from "./components";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchHotels } from './actions/hotel';
import { fetchBookings } from './actions/booking';

const App = () => {
  // Setting Dispatch
  const dispatch = useDispatch();

  // Using State
  const [hotels, setHotels] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);

  // Defining Logout function
  const logout = () => {
    setUser(null);
  };

  // Initial Fetch
  useEffect(() => { 
    dispatch(fetchHotels(setHotels))
  }, []);

  // Fetching Bookings function
  const loadBookings = () => {
    if (user) {
      dispatch(fetchBookings(user._id, setBookings));
    }
  }

  // Building Layout
  return (
    <Router>
      <div>
        <Navbar user={user} logout={logout} loadBookings={loadBookings}/>
        <Routes>
          <Route path='/' element={<Hotels hotels={hotels} setHotel={setHotel} />} />
          <Route path="/auth" element={<Auth setUser={setUser} />} />
          <Route path="/bookings" element={<Bookings bookings={bookings} setBookings={setBookings}/>} />
          <Route path="/hotel" element={<HotelDetails hotel={hotel} user={user} setBooking={setBooking} />} />
          <Route path="/payment" element={<Payment booking={booking} loadBookings={loadBookings}/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
