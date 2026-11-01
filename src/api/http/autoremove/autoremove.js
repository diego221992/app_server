import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const autoremove = async (data) => {
    const response = await axios.post(
        `${apiUrl}autoremove/remove`,
        data,
        config
    );
    return response.data;
}

const listAutoremove = async (username) => {
    const response = await axios.post(
        `${apiUrl}autoremove/list`,
        { username},
        config
    );
    return response.data;
}

const deleteAutoremove = async (id, username) => {
    const response = await axios.post(
        `${apiUrl}autoremove/delete`,
        { id, username },
        config
    );
    return response.data;
}

export default {
    listAutoremove,
    deleteAutoremove,
    autoremove
};