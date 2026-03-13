import { Request, Response } from 'express';
import * as service from '../services (Бізнес-логіка, робота з даними)/accessType.service';
import * as Dto from '../dtos (валідація+структура)/accessType.dto';

export const getAll = (req: Request, res: Response) => {
    const types = service.getAll();
    res.json(types.map(Dto.toResponse));
};

export const create = (req: Request, res: Response) => {
    try {
        const error = Dto.validate(req.body);
        if (error) return res.status(400).json({ error });

        const newType = service.create(req.body);
        res.status(201).json(Dto.toResponse(newType));
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};