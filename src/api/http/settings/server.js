import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const getServer = async () => {
    const response = await axios.post(
        `${apiUrl}server/get`,
        config
    );
    return response.data;
}

const updateServer = async (data) => {
    const response = await axios.post(
        `${apiUrl}server/update`,
        data,
        config
    );
    return response.data;
}
export default {
    getServer,
    updateServer
}