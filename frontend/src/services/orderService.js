import axios from 'axios';

export const getOrders = (userId) => {
  return axios.get(`http://localhost:5000/api/orders/user/${userId}`);
};
