import { Request, Response } from 'express';
import * as service from '../services (Бізнес-логіка, робота з даними)/status.service';
import * as Dto from '../dtos (валідація+структура)/status.dto';

export const getAll = (req: Request, res: Response) => {
    const statuses = service.getAll();
    res.json(statuses.map(Dto.toResponse));
};

export const getById = (req: Request, res: Response) => {
    const status = service.getById(Number(req.params.id));
    if (!status) return res.status(404).json({ error: "Статус не знайдено" });
    res.json(Dto.toResponse(status));
};

export const create = (req: Request, res: Response) => {
    const error = Dto.validate(req.body);
    if (error) return res.status(400).json({ error });
    
    const newStatus = service.create(req.body);
    res.status(201).json(Dto.toResponse(newStatus));
};

export const remove = (req: Request, res: Response) => {
    const success = service.remove(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Статус не знайдено" });
    res.status(204).send();
};