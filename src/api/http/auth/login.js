import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const login = async (username, password) => {
    const response = await axios.post(
        `${apiUrl}auth/login`,
        { username, password },
        config
    );
    return response.data;
}

export default {
    login
}