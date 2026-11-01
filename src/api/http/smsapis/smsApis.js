import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const listApis = async () => {
    const response = await axios.post(
        `${apiUrl}smsApis/list`,
        config
    );
    return response.data;
}

const addApis = async (data) => {
    const response = await axios.post(
        `${apiUrl}smsApis/add`,
        data,
        config
    );
    return response.data;
}


const updateValue = async (data) => {
    const response = await axios.post(
        `${apiUrl}smsApis/updateValue`,
        data,
        config
    );
    return response.data;
}

const deleteApi =  async (_id) => {
     const response = await axios.post(
        `${apiUrl}smsApis/deleteApi`,
        {_id},
        config
    );
    return response.data;
}

export default {
   listApis,
   addApis,
   updateValue,
   deleteApi
}
