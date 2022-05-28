import * as api from '../api';

export const fetchHotels = (setHotels) => async () => {
    try {
        const { data } = await api.initialFetch();
        setHotels(data.payload);
    } catch (error) {
        console.log(error);
    }
}

export const fetchHotel = (hotelID, setHotel) => async () => {
    try {
        const { data } = await api.fetchHotel({ "hotelID": hotelID });
        if (data.status === 200) {
            setHotel(data.payload)
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.log(error);
    }
}
