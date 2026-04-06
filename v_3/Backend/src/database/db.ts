import sqlite3 from 'sqlite3';
import path from 'path';
const dbPath = path.join(process.cwd(), 'data', 'database.db');
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Помилка відкриття бази даних:', err.message);
    } else {
        console.log('Успішно підключено до SQLite.');
        console.log('Шлях до бази:', dbPath);
        db.run('PRAGMA foreign_keys = ON;', (err) => {  // Вмикаємо підтримку зовнішніх ключів//
            if (err) console.error('Помилка PRAGMA:', err.message);
        });
    }
})
// Функція для виконання запитів (Promise wrapper)//
export const query = (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};