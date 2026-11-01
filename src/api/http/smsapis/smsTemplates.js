import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};

const addTemplate = async (data) => {
    const response = await axios.post(
        `${apiUrl}smsApis/addTemplate`,
        data,
        config
    );
    return response.data;
}

const listTemplates = async () => {
    const response = await axios.post(
        `${apiUrl}smsApis/listTemplates`,
        config
    );
    return response.data;
}

const updateValueTemplate = async (data) => {
     const response = await axios.post(
        `${apiUrl}smsApis/updateValueTemplate`,
        data,
        config
    );
    return response.data;
}

const deleteTemplate =  async (_id) => {
     const response = await axios.post(
        `${apiUrl}smsApis/deleteTemplate`,
        {_id},
        config
    );
    return response.data;
}

export default {
   listTemplates,
   addTemplate,
   updateValueTemplate,
   deleteTemplate
}
