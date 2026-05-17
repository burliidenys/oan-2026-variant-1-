import { db } from '../database/db';
import { AccessRequest, AccessRequestDTO } from '../../../shared/types';
export const getAll = (filters: any = {}, limit: number = 50): Promise<AccessRequest[]> => {
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
        if (filters.search) {
            sql += ` AND (u.name LIKE ? OR r.details LIKE ?)`;
            const searchVal = `%${filters.search}%`;
            params.push(searchVal, searchVal);
        }
        if (filters.accessTypeId && filters.accessTypeId !== 'all') {
            sql += ` AND r.accessTypeId = ?`;
            params.push(Number(filters.accessTypeId));
        }
            sql += ` ORDER BY typeLabel ASC, r.createdAt DESC LIMIT ?`;
        params.push(limit);
        db.all(sql, params, (err, rows: AccessRequest[]) => {
            if (err) reject(err);
            else resolve(rows || []);
            const typeId = filters.accessTypeId || filters.type; 
if (typeId && typeId !== 'all') {
    sql += ` AND r.accessTypeId = ?`;
    params.push(Number(typeId));
}
        });
    });
};

export const create = (data: AccessRequestDTO): Promise<AccessRequest> => {
    return new Promise((resolve, reject) => {
        const { userId, details, statusId, accessTypeId } = data;
        const date = new Date().toISOString();
        const sql = `INSERT INTO requests (userId, details, statusId, accessTypeId, createdAt) VALUES (?, ?, ?, ?, ?)`;
        
        db.run(sql, [userId, details, statusId, accessTypeId, date], function(err) {
            if (err) return reject(err);
        
            const result: AccessRequest = {
                id: this.lastID,
                userName: data.userName, // Беремо з DTO
                details: details,
                accessTypeId: Number(accessTypeId), 
                requestDate: data.requestDate,
                createdAt: date
            };            
            resolve(result);
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
        const sql = `
            SELECT r.*, u.name as userName, s.name as statusLabel, a.name as typeLabel
            FROM requests r
            LEFT JOIN users u ON r.userId = u.id
            LEFT JOIN statuses s ON r.statusId = s.id
            LEFT JOIN access_types a ON r.accessTypeId = a.id
            WHERE r.id = ?
        `;
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const findAll = (filters?: { userName?: string, accessTypeId?: number }): Promise<AccessRequest[]> => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT r.*, u.name as userName, a.name as typeLabel
            FROM requests r
            LEFT JOIN users u ON r.userId = u.id
            LEFT JOIN access_types a ON r.accessTypeId = a.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (filters?.userName) {
            sql += ` AND u.name LIKE ?`;
            params.push(`%${filters.userName}%`);
        }

        if (filters?.accessTypeId && !isNaN(filters.accessTypeId)) {
            sql += ` AND r.accessTypeId = ?`;
            params.push(filters.accessTypeId);
        }

        db.all(sql, params, (err, rows: AccessRequest[]) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

export const remove = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM requests WHERE id = ?`;
        db.run(sql, [id], (err) => {
            if (err) reject(err);
            else resolve();
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
        db.all(sql, [], (err, rows: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};
export const safeSearch = (detailsPart: string): Promise<AccessRequest[]> => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                r.id, r.details, r.createdAt, r.userId, r.accessTypeId, r.statusId,
                u.name as userName, s.name as statusLabel, a.name as typeLabel 
            FROM requests r
            LEFT JOIN users u ON r.userId = u.id
            LEFT JOIN statuses s ON r.statusId = s.id
            LEFT JOIN access_types a ON r.accessTypeId = a.id
            WHERE r.details LIKE ?
        `;

        // Формуємо рядок пошуку з відсотками для оператора LIKE//
        const searchVal = `%${detailsPart}%`;
        // Передаємо значення окремим масивом. //
        db.all(sql, [searchVal], (err, rows: AccessRequest[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};