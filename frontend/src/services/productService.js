
import axios from 'axios';

export const getAllProducts = async () => {
  const res = await axios.get('http://localhost:5000/api/products');
  return res.data;
};

export const getProductById = async (id) => {
  return await axios.get(`http://localhost:5000/api/products/${id}`);
};
