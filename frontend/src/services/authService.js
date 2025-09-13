import API from './api';
import axios from 'axios';

export const login = async (data) => {
  const res = await API.post('/auth/login', data);
  return res.data.token;
};


export const signup = async (formData) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
    return res.data.token;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};