import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const getProfile = async (username) => {
    const response = await axios.post(
        `${apiUrl}users/profile/get`,
        { username },
        config
    );
    return response.data;
}

const updateProfile = async (data) => {
    const response = await axios.post(
        `${apiUrl}users/profile/update`,
        data,
        config
    );
    return response.data;
}

export default {
    updateProfile,
    getProfile
};