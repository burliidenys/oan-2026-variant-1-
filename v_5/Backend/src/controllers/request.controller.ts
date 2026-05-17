import { Request, Response, NextFunction } from 'express';
import * as service from '../services/request.service';
import * as Dto from '../dtos/request.dto';
import { AppError } from '../middleware/error.middleware';
import * as repo from '../repositories/request.repository';
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await service.getAll(req.query);
        res.json(requests.map(Dto.toResponse));
    } catch (e) {
        next(e);
    }
};
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = await service.getById(Number(req.params.id));
        if (!request) throw new AppError(404, "Заявку не знайдено");
        res.json(Dto.toResponse(request));
    } catch (e) {
        next(e);
    }
};
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationError = Dto.validate(req.body);
        if (validationError) throw new AppError(400, validationError);
        const newRequest = await service.create(req.body);
        res.status(201).json(Dto.toResponse(newRequest));
    } catch (e) {
        next(e);
    }
};
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationError = Dto.validate(req.body);
        if (validationError) throw new AppError(400, validationError);
        const id = Number(req.params.id);
        const updatedRequest = await service.update(id, req.body);
        if (!updatedRequest) throw new AppError(404, "Заявку для оновлення не знайдено");
        res.json(Dto.toResponse(updatedRequest));
    } catch (e) {
        next(e);
    }
};
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = Number(req.params.id);
        const currentUserId = Number(req.headers['x-demo-userid']);

        if (!currentUserId) {
            return res.status(401).json({ message: "401 Unauthorized" });
        }

        await service.removeSecure(requestId, currentUserId);
        res.status(204).send();
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message });
    }
};
export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await service.getStatistics();
        res.json({
            data: result.stats,
            meta: { totalRequests: result.total }
        });
    } catch (e) {
        next(e);
    }
};
export const dangerousSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = (req.query.q as string) || "";
        const results = await safeSearch(query);
        res.json({ data: results });
    } catch (e) {
        next(e);
    }
};
export const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = Number(req.params.id);
        // Отримуємо ID користувача із заголовка//
        const currentUserId = Number(req.headers['x-demo-userid']);
        if (!currentUserId) {
            return res.status(401).json({ message: "401 Unauthorized: Користувач не ідентифікований" });
        }

        // Викликаємо БЕЗПЕЧНИЙ метод сервісу, який перевіряє, чи має користувач право видаляти цей запит//
        await service.removeSecure(requestId, currentUserId);
        
        res.status(204).send();
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || "Internal Error" });
    }
};

function safeSearch(query: string) {
    throw new Error('Function not implemented.');
}