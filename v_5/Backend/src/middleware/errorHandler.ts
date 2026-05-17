import { Request, Response, NextFunction } from 'express';
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Якщо контролер передав конкретний статус (наприклад, 400, 403, 404), беремо його. 
    // Якщо це непередбачуваний збій сервера, виставляємо 500 Internal Server Error.//
    const status = err.status || 500;
    
    // Завжди маскуємо внутрішні дев-деталі.
    // Клієнту віддаємо лише безпечне текстове повідомлення.//
    const message = err.message || 'Внутрішня помилка сервера';
    // Логування повної помилки в консоль сервера для розробника (безпечно, бо не йде клієнту)//
    console.error(`[ERROR] [${new Date().toISOString()}] Status: ${status} | Message: ${err.message}`);
    if (err.stack && status === 500) {
        console.error(err.stack);
    }
    // Повертаємо уніфіковану, безпечну JSON-відповідь//
    res.status(status).json({
        success: false,
        status: status,
        message: message,
        timestamp: new Date().toISOString()
    });
};
