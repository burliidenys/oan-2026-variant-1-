import { db } from '../database/db';

export const getAll = (filters: any = {}, limit: number = 50): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT 
                r.id, r.details, r.createdAt, r.userId, r.accessTypeId, r.statusId,
                u.name as userName, s.name as statusLabel, a.name as typeLabel 
            FROM requests r
            LEFT JOIN users u ON r.userId = u.id
            LEFT JOIN statuses s ON r.statusId = s.id
            LEFT JOIN access_types a ON r.accessTypeId = a.id
            WHERE 1=1
        `;
        const params: any[] = [];
        if (filters.accessTypeId && filters.accessTypeId !== 'all') {
            sql += ` AND r.accessTypeId = ?`;
            params.push(Number(filters.accessTypeId));
        }
        sql += ` ORDER BY r.id DESC LIMIT ?`;
        params.push(limit);

        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const create = (data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const { userId, details, statusId, accessTypeId } = data;
        const date = new Date().toISOString();
        const sql = `INSERT INTO requests (userId, details, statusId, accessTypeId, createdAt) VALUES (?, ?, ?, ?, ?)`;
        
        db.run(sql, [userId, details, statusId, accessTypeId, date], function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, ...data, createdAt: date });
        });
    });
};

export const update = (id: number, data: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(data);
        if (keys.length === 0) return resolve(false);

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const params = [...Object.values(data), id];

        const sql = `UPDATE requests SET ${setClause} WHERE id = ?`;

        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
};

export const findOne = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM requests WHERE id = ?`, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const remove = (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM requests WHERE id = ?`, [id], function(err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
};


export const getStatsAggregation = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s.name as status, COUNT(r.id) as count 
            FROM statuses s
            LEFT JOIN requests r ON s.id = r.statusId
            GROUP BY s.id
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};
export const unsafeSearch = (detailsPart: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        // Демонстрація SQL Injection (через конкатенацію)
        const sql = "SELECT * FROM requests WHERE details LIKE '%" + detailsPart + "%'";
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};