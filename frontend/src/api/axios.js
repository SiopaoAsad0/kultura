import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const instance = axios.create({
  baseURL: API_URL + '/api', // backend API prefix
  withCredentials: true,     // useful if using Sanctum (cookie auth)
  headers: {
    'Accept': 'application/json',
  },
});

export default instance;
