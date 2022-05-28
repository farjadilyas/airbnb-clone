import * as api from '../api';

export const signin = (formData, setAuthError, setUser) => async () => {
    try {
        const { data } = await api.signin(formData);
        if (data.status === 200) { 
            setUser(data.payload);
        }
        else {
            setAuthError(data);
        }
    } catch (error) {
        setAuthError(error.response.data);
    }
}

export const signup = (formData, setAuthError, setUser) => async () => {
    try {
        const { data } = await api.signup(formData);
        if (data.status === 200) { 
            setUser(data.payload);
        }
        else {
            setAuthError(data);
        }
    } catch (error) {
        setAuthError(error.response.data);
    }
}
