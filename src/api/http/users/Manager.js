import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const addUsers = async (data) => {
    const response = await axios.post(
        `${apiUrl}users/add`,
        data,
        config
    );
    return response.data;
}


const listUsers = async () => {
    const response = await axios.post(
        `${apiUrl}users/list`,
        config
    );
    return response.data;
}

const deleteUsers = async (username) => {
    const response = await axios.post(
        `${apiUrl}users/delete`,
        { username },
        config
    );
    return response.data;
}

const updateValue = async (data) => {
    const response = await axios.post(
        `${apiUrl}users/updateValue`,
        data,
        config
    );
    return response.data;
}


export default {
    listUsers,
    deleteUsers, 
    updateValue,
    addUsers
};