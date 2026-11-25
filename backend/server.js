
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import animalRoutes from './routes/animalRoutes.js';

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// TEST ROUTE
app.get('/', (req, res) => {
    res.send('Livestock Collar API is running');
});

// HEALTH CHECK ROUTE
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Livestock Collar API is healthy'
    });
});

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);

// START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
