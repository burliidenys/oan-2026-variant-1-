import { db } from '../database/db';
import { User } from '../entities/user.entity';
export const findAll = async (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', [], (err, rows: User[]) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
export const findByName = async (name: string): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE name = ?', [name], (err, row: User) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};
export const findById = async (id: number): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row: User) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};
export const create = (data: { name: string }): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Використовуємо звичайну функцію (не стрілочну), щоб мати доступ до 'this'
        db.run(`INSERT INTO users (name) VALUES (?)`, [data.name], function(err) {
            if (err) return reject(err);
            resolve({ 
                id: this.lastID, 
                name: data.name 
            });
        });
    });
};
export const update = async (id: number, data: Partial<User>): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE users SET name = ? WHERE id = ?`;
        db.run(sql, [data.name, id], function (err) {
            if (err) reject(err);
            else if (this.changes === 0) resolve(null);
            else findById(id).then(user => resolve(user || null));
        });
    });
};
export const remove = async (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
};