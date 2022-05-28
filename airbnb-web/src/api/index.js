import axios from "axios";

// Testing Version
// // Defining API Routes
// const HOTEL_API = axios.create({ baseURL: "http://localhost:3001"});
// const USER_API = axios.create({ baseURL: "http://localhost:3002"});
// const BOOKING_API = axios.create({ baseURL: "http://localhost:3003" });

// // Routes for Hotel API
// export const initialFetch = () => HOTEL_API.get("/hotels");
// export const fetchHotel = (data) => HOTEL_API.post("/hotel", data);

// // Routes for User API
// export const signin = (formData) => USER_API.post("/login", formData);
// export const signup = (formData) => USER_API.post("/signup", formData);

// // Routes for Booking API
// export const fetchBookings = (userId) => BOOKING_API.post("/bookings", {userId});
// export const createBooking = (formData) => BOOKING_API.post("/createBooking", formData); 
// export const checkInBooking = (bookingId) => BOOKING_API.post("/checkIn", {bookingId});
// export const checkOutBooing = (bookingId) => BOOKING_API.post("/checkOut", {bookingId});

// Deployment Version
// Defining API Routes
const HOTEL_API = axios.create();
const USER_API = axios.create();
const BOOKING_API = axios.create();

// Routes for Hotel API
export const initialFetch = () => HOTEL_API.get("/airbnb-hotel/hotels");
export const fetchHotel = (data) => HOTEL_API.post("/airbnb-hotel/hotel", data);

// Routes for User API
export const signin = (formData) => USER_API.post("/airbnb-user/login", formData);
export const signup = (formData) => USER_API.post("/airbnb-user/signup", formData);

// Routes for Booking API
export const fetchBookings = (userId) => BOOKING_API.post("/airbnb-booking/bookings", {userId});
export const createBooking = (formData) => BOOKING_API.post("/airbnb-booking/createBooking", formData); 
export const checkInBooking = (bookingId) => BOOKING_API.post("/airbnb-booking/checkIn", {bookingId});
export const checkOutBooking = (bookingId) => BOOKING_API.post("/airbnb-booking/checkOut", {bookingId});
