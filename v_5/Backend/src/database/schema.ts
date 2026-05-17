import { db } from './db';
export const initSchema = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS statuses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS access_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            details TEXT NOT NULL,
            statusId INTEGER NOT NULL DEFAULT 1,
            accessTypeId INTEGER NOT NULL DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (statusId) REFERENCES statuses(id),
            FOREIGN KEY (accessTypeId) REFERENCES access_types(id)
        )`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_requests_userId ON requests(userId)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_requests_statusId ON requests(statusId)`);
        const statuses = ['Pending', 'Approved', 'Rejected'];
        statuses.forEach((status, index) => {
            db.run(`INSERT OR IGNORE INTO statuses (id, name) VALUES (?, ?)`, [index + 1, status]);
        });
        const types = [
            {id: 1, name: 'Temporary'},
            {id: 2, name: 'Full Access'},
            {id: 3, name: 'Admin'},
            {id: 4, name: 'Read Only'}
        ];
        types.forEach(type => {
            db.run(`INSERT OR IGNORE INTO access_types (id, name) VALUES (?, ?)`, [type.id, type.name]);
        });
        console.log(' Схему БД ініціалізовано, індекси створено, довідники заповнено.');
    });
};