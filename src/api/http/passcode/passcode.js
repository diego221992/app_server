import axios from 'axios';

const apiUrl = window.APP_CONFIG.API_URL;

const config = {
    withCredentials: true, // Asegura que las cookies se envíen
    headers: {
        'Content-Type': 'application/json',
    },
};


const addProcess = async (data) => {
    const response = await axios.post(
        `${apiUrl}passcode/add`,
        data,
        config
    );
    return response.data;
}

const listProcesses = async (username) => {
    const response = await axios.post(
        `${apiUrl}passcode/list`,
        { username },
        config
    );
    return response.data;
}

const listObtained = async (data) => {
    const response = await axios.post(
        `${apiUrl}passcode/listObtained`,
        data,
        config
    );
    return response.data;
}

const deletePasscode = async (data) => {
    const response = await axios.post(
        `${apiUrl}passcode/deletePasscode`,
        data,
        config
    );
    return response.data;
}





const addCTwilioCredentials = async (data) => {
    const response = await axios.post(
        `${apiUrl}passcode/addCTwilioCredentials`,
        data,
        config
    )
    return response.data;
}

const getTwilioCredentials = async () => {
    const response = await axios.post(
        `${apiUrl}passcode/getTwilioCredentials`,
        config
    )
    return response.data;
}

const call = async (data) => {
    const response = await axios.post(
        `${apiUrl}passcode/services/call`,
        data,
        config
    )

    return response.data;
}

const inProgress = async (data) => {
    const response = await axios.post(
        `${apiUrl}passcode/services/inProgress`,
        data,
        config
    )

    return response.data;
}

const updateCredits = async (username) => {
    const response = await axios.post(
        `${apiUrl}passcode/services/updateCredits`,
        { username },
        config
    )

    return response.data;
}

const terminateCall = async (data) => {
    const response = await axios.post(
        `${apiUrl}passcode/services/terminateCall`,
        data,
        config
    )

    return response.data;
}

export default {
    addProcess,
    listProcesses,
    listObtained,
    deletePasscode,
    addCTwilioCredentials,
    getTwilioCredentials,
    call,
    inProgress,
    updateCredits,
    terminateCall
};