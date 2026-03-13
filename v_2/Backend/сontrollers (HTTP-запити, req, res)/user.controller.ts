import { Request, Response } from 'express';
import * as userService from '../services (Бізнес-логіка, робота з даними)/user.service';
import * as UserDto from '../dtos (валідація+структура)/user.dto';

export const getAll = (req: Request, res: Response) => {
    // req.query передаємо в сервіс
    const users = userService.getAll(req.query as any);
    res.json(users.map(UserDto.toResponse));
};

export const getById = (req: Request, res: Response) => {
    const user = userService.getById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: "Користувач не знайдений" });
    res.json(UserDto.toResponse(user));
};

export const create = (req: Request, res: Response) => {
    const error = UserDto.validate(req.body);
    if (error) return res.status(400).json({ error });
    
    const newUser = userService.create(req.body);
    res.status(201).json(UserDto.toResponse(newUser));
};

export const update = (req: Request, res: Response) => {
    const updated = userService.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Не знайдено" });
    res.json(UserDto.toResponse(updated));
};

export const remove = (req: Request, res: Response) => {
    const success = userService.remove(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "Не знайдено" });
    res.status(204).send();
};