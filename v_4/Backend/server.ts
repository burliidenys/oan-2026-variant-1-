import express from 'express';
import cors from 'cors';
import path from 'path';
import { db } from './src/database/db';
import { runMigrations } from './src/database/migrator'; 
import requestRoutes from './src/routes/request.routes';
import userRoutes from './src/routes/user.routes';
import statusRoutes from './src/routes/status.routes';
import accessTypeRoutes from './src/routes/accessType.routes';
const API_VERSION = '/api/v4';
const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000'
];
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        //якщо origin є у списку дозволених//
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600 
};

const app = express();
const PORT = 3000;
app.use(cors(corsOptions));
app.use(express.json());

const bootstrap = async () => {
    try {
        console.log(" Перевірка бази даних та запуск міграцій...");
        
        await runMigrations(db);
        
        console.log(" Базу даних успішно ініціалізовано.");
    } catch (err) {
        console.error(" Помилка ініціалізації БД:", err);
    }
};

bootstrap(); 

app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/requests`, requestRoutes);
app.use(`${API_VERSION}/statuses`, statusRoutes);
app.use(`${API_VERSION}/access-types`, accessTypeRoutes);
const FRONTEND_URL = 'http://127.0.0.1:5500';
app.listen(PORT, () => {
    console.log(` Сервер працює на http://localhost:${PORT}`);
    console.log(`ВІДКРИЙ ІНТЕРФЕЙС ТУТ: ${FRONTEND_URL}`);
});