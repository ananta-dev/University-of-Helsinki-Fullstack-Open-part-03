/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
// const baseUrl = "http://localhost:3001/persons";

// This frontend is going to be deployed inside the backend, so we use a relative path
// If we deployed the frontend to a different server we would have to use the following:
// const baseUrl = "https://ancient-everglades-91112.herokuapp.com/api/persons";
const baseUrl = "/api/persons";

const getAll = () => {
    return axios.get(baseUrl);
};

const addEntry = newPerson => {
    return axios.post(baseUrl, newPerson);
};

const deleteEntry = id => {
    return axios.delete(`${baseUrl}/${id}`);
};

const updateEntry = modifiedPerson => {
    return axios.put(`${baseUrl}/${modifiedPerson.id}`, modifiedPerson);
};

export default { getAll, addEntry, deleteEntry, updateEntry };
