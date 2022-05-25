import * as api from '../api';

export const fetchData = (setMessages) => async () => {
    try {
        const { data } = await api.initialFetch();
        setMessages(data);
    } catch (error) {
        console.log("Error Happened!");
    }
}
