import express from 'express';
import path from 'path';
import userRoutes from './src/routes (Маршрути)/user.routes';
import requestRoutes from './src/routes (Маршрути)/request.routes';
import statusRoutes from './src/routes (Маршрути)/status.routes';
import accessTypeRoutes from './src/routes (Маршрути)/accessType.routes';

const app = express();
const PORT = 3000;

// Мідлвар для обробки JSON-тіла в запитах
app.use(express.json());

// Підключення маршрутів
app.use('/users', userRoutes);
app.use('/requests', requestRoutes);
app.use('/statuses', statusRoutes);
app.use('/access-types', accessTypeRoutes);


app.use(express.static(path.join(__dirname, '../Frontend')));

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});