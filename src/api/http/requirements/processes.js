import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const stats = async (username) => {
    const response = await axios.post(
        `${apiUrl}requirements/stats`,
        { username },
        config
    );
    return response.data;
}

const addProcess = async (data) => {
    const response = await axios.post(
        `${apiUrl}requirements/add`,
        data,
        config
    );
    return response.data;
}

const updateValue = async (data) => {
    const response = await axios.post(
        `${apiUrl}requirements/updateValue`,
        data,
        config
    );
    return response.data;
}
const listProcesses = async (username) => {
    const response = await axios.post(
        `${apiUrl}requirements/list`,
        { username },
        config
    );
    return response.data;
}

const deleteProcess = async (id) => {
    const response = await axios.post(
        `${apiUrl}requirements/delete`,
        { id },
        config
    );
    return response.data;
}

const listObtained = async (data) => {
    const response = await axios.post(
        `${apiUrl}requirements/listObtained`,
        data,
        config
    );

    return response.data;
}

const listObtainedUsername = async (username) =>{
    const response = await axios.post(
        `${apiUrl}requirements/listObtainedUsername`,
        {username},
        config
    );
    return response.data;    
}

const deleteObtained = async (id) => {
    const response = await axios.post(
        `${apiUrl}requirements/deleteObtained`,
        { id },
        config
    );
    return response.data;
}


export default {
    stats,
    addProcess,
    updateValue,
    listProcesses,
    deleteProcess,
    listObtained,
    listObtainedUsername,
    deleteObtained
};