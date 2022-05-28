import * as api from '../api';

export const fetchBookings = (userId, setBookings) => async () => {
    try {
        const { data } = await api.fetchBookings(userId);
        if (data.status === 200) {
            setBookings(data.payload);
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

export const createBooking = (booking, setSuccess) => async () => {
    try {
        const { data } = await api.createBooking(booking);
        if (data.status === 200) {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
    } catch (error) {
        console.log(error);
    }
}

export const checkInHotel = (bookingId) => async () => {
    try {
        const { data } = await api.checkInBooking(bookingId);
        if (data.status !== 200) {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

export const checkOutHotel = (bookingId) => async () => {
    try {
        const { data } = await api.checkOutBooking(bookingId);
        if (data.status !== 200) {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error);
    }
}
