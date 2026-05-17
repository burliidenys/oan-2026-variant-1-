import { Request, Response, NextFunction } from 'express';
//Спеціальний клас для помилок//
export class AppError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
        this.name = 'AppError';
    }
}
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Сталася внутрішня помилка сервера';
    console.error(`[ERROR] ${req.method} ${req.url} - Status: ${statusCode} - Message: ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }
    res.status(statusCode).json({
    status: statusCode, // Числовий код (400, 404 тощо)//
    title: statusCode >= 500 ? 'Server Error' : 'Client Error',
    message: message, //"Detail"//
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
});
};