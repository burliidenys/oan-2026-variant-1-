import express from 'express';
import path from 'path';
import { db } from './src/database/db';
import { runMigrations } from './src/database/migrator'; 
import requestRoutes from './src/routes/request.routes';
import userRoutes from './src/routes/user.routes';
import statusRoutes from './src/routes/status.routes';
import accessTypeRoutes from './src/routes/accessType.routes';

const app = express();
const PORT = 3000;
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

const frontendPath = path.resolve(__dirname, '..', '..', 'Frontend');
app.use(express.static(frontendPath));

app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/statuses', statusRoutes);
app.use('/access-types', accessTypeRoutes);

app.use(express.static(path.join(__dirname, '../Frontend')));

app.listen(PORT, () => {
    console.log(` Сервер працює на http://localhost:${PORT}`);
});