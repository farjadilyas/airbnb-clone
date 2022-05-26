import * as api from '../api';

export const fetchHotels = (setHotels) => async () => {
    try {
        const { data } = await api.initialFetch();
        console.log(data);
        setHotels(data.payload);
    } catch (error) {
        console.log("Error Happened!");
    }
}
