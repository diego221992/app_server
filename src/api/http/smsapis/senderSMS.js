import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};



const sendSMS = async (data) => {
    const response = await axios.post(
        `${apiUrl}sender/sendSMS`,
        data,
        config
    );
    return response.data;
}


export default {
   sendSMS
}
