import { Request, Response, NextFunction } from 'express';
import * as service from '../services/request.service';
import * as Dto from '../dtos/request.dto';
import { AppError } from '../middleware/error.middleware';

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
        const result = await service.update(Number(req.params.id), req.body);
        if (!result) throw new AppError(404, "Заявку не знайдено");
        res.json({ message: 'Оновлено успішно' });
    } catch (e) {
        next(e);
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const success = await service.remove(Number(req.params.id));
        if (!success) throw new AppError(404, "Заявку не знайдено");
        res.status(204).send();
    } catch (e) {
        next(e);
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
        const results = await service.searchUnsafe(query);
        res.json({ data: results });
    } catch (e) {
        next(e);
    }
};