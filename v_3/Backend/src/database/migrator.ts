import fs from 'fs';
import path from 'path';
import { Database } from 'sqlite3';
export const runMigrations = async (db: Database) => {
    return new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, async (err) => {
            if (err) return reject(err);
            try {
                const migrationsDir = path.join(process.cwd(), 'migrations');
                if (!fs.existsSync(migrationsDir)) {
                    console.warn(' Папку migrations не знайдено за шляхом:', migrationsDir);
                    return resolve(true);
                }
                const files = fs.readdirSync(migrationsDir)
                    .filter(f => f.endsWith('.sql'))
                    .sort();
                for (const file of files) {
                    const isApplied = await checkIfApplied(db, file);
                    
                    if (!isApplied) {
                        console.log(` [Migration] Застосування файлу: ${file}...`);
                        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                        try {
                            await executeSql(db, sql);
                            await markAsApplied(db, file);
                            console.log(` [Migration] ${file} успішно застосовано.`);
                        } catch (sqlError: any) {
                            console.error(` Помилка у файлі ${file}:`, sqlError.message);
                            throw sqlError;
                        }
                    } else {
                        console.log(` [Migration] Пропущено (вже є в базі): ${file}`);
                    }
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    });
};
function executeSql(db: Database, sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}
function checkIfApplied(db: Database, name: string): Promise<boolean> {
    return new Promise((resolve) => {
        db.get(`SELECT id FROM schema_migrations WHERE name = ?`, [name], (err, row) => {
            if (err) resolve(false);
            resolve(!!row);
        });
    });
}
function markAsApplied(db: Database, name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO schema_migrations (name) VALUES (?)`, [name], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}