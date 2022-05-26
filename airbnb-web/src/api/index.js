import axios from "axios";

const HOTEL_API = axios.create();

export const initialFetch = () => HOTEL_API.get("/airbnb-hotel/hotels");
