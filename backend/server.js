const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const  userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const vendorRoutes = require("./routes/vendorRoutes");
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/vendors", vendorRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
