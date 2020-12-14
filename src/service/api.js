import axios from 'axios';

const api = axios.create({
  baseURL: "https://testenode-1.herokuapp.com/"
})

export default api;