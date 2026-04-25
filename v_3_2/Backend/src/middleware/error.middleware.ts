import { Request, Response, NextFunction } from 'express';
//Спеціальний клас для помилок//
export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
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
        status: 'error',
        statusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};