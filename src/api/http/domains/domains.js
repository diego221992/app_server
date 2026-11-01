import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const listDomains = async (username) => {
    const response = await axios.post(
        `${apiUrl}domains/list`,
        { username },
        config
    );
    return response.data;
}

const addDomain = async (data) => {
    const response = await axios.post(
        `${apiUrl}domains/add`,
        data,
        config
    );
    return response.data;
}

const deleteDomain = async (domain) => {
    const response = await axios.post(
        `${apiUrl}domains/delete`,
        { domain },
        config
    );
    return response.data;
}


const assignDomain = async (data) => {
    const response = await axios.post(
        `${apiUrl}domains/assignDomain`,
        data,
        config
    )

    return response.data;
}

const listAssignDomain = async (username) => {
    const response = await axios.post(
        `${apiUrl}domains/listAssignDomain`,
        { username },
        config
    );
    return response.data;
}

const deleteAssignDomain = async (data) => {
    const response = await axios.post(
        `${apiUrl}domains/deleteAssignDomain`,
        data,
        config
    );
    return response.data;
}



export default {
    addDomain,
    listDomains,
    deleteDomain,
    assignDomain,
    listAssignDomain,
    deleteAssignDomain
}