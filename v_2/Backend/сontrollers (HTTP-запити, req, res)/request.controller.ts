import { Request, Response } from 'express';
import * as service from '../services (Бізнес-логіка, робота з даними)/request.service';
import * as Dto from '../dtos (валідація+структура)/request.dto';

export const getAll = (req: Request, res: Response) => {
    const requests = service.getAll(req.query as any);
    res.json(requests.map(Dto.toResponse));
};

export const getById = (req: Request, res: Response) => {
    const request = service.getById(Number(req.params.id));
    if (!request) return res.status(404).json({ error: "Запит не знайдено" });
    res.json(Dto.toResponse(request));
};

export const create = (req: Request, res: Response) => {
    const error = Dto.validate(req.body);
    if (error) return res.status(400).json({ error });
    
    const newReq = service.create(req.body);
    res.status(201).json(Dto.toResponse(newReq));
};

export const update = (req: Request, res: Response) => {
    const updated = service.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Запит не знайдено" });
    res.json(Dto.toResponse(updated));
};

export const remove = (req: Request, res: Response) => {
    const success = service.remove(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Запит не знайдено" });
    res.status(204).send();
};