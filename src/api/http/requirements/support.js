import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const addDomain = async (data) => {
    const response = await axios.post(
        `${apiUrl}support/add`,
        data,
        config
    );
    return response.data;
}

const getDomain = async (data) => {
    const response = await axios.post(
        `${apiUrl}support/get`,
        data,
        config
    )

    return response.data;
}

const updateOption = async (data) => {
    const response = await axios.post(
        `${apiUrl}support/updateOption`,
        data,
        config
    )
    return response.data;

}

const listObtainedSupport = async (username) => {
    const response = await axios.post(
        `${apiUrl}support/listFilter`,
        {username}
    )

    return response.data;
}

const listDetailSupport = async (data) => {
    const response = await axios.post(
        `${apiUrl}support/listDetails`,
        data
    )

    return response.data;
}

const deleteProcess = async (id) => {
    const response = await axios.post(
        `${apiUrl}support/delete`,
        { id },
        config
    );
    return response.data;
}


const deleteDomain = async (data) => {
    const response = await axios.post(
        `${apiUrl}support/deleteDomain`,
        data,
        config
    );
    return response.data;
}


export default { 
    addDomain, 
    getDomain,
    updateOption,
    listObtainedSupport,
    listDetailSupport,
    deleteProcess,
    deleteDomain
}
