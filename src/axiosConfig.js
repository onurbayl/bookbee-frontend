import axios from 'axios';

const axiost = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Make sure this variable is defined in your .env file
  timeout: 5000, // 5 seconds
});

export default axiost;