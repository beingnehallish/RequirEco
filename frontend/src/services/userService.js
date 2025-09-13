
import axios from 'axios';

export const getUserById = async (id) => {
  return await axios.get(`http://localhost:5000/api/users/${id}`);
};
