// src/server.ts
import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from './config/db';
import designRoutes from './routes/designRoutes';

// Load env vars
dotenv.config();

// Connect to database (Async call)
connectDB();

const app: Express = express();

// Middleware
// 1. CORS: Cho phép Frontend (ví dụ: http://localhost:5173) truy cập
app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// 2. Body parser: Đọc JSON từ request body
app.use(express.json({ limit: '50mb' })); 

// Define Routes
// Gắn tất cả routes từ designRoutes.ts vào base path '/api/design'
app.use('/api/design', designRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    () => console.log(`Server đang chạy ở cổng ${PORT}`)
);