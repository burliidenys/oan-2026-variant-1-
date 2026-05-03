import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as UserDto from '../dtos/user.dto';
import { AppError } from '../middleware/error.middleware';
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //await, щоб отримати масив користувачів, а не Promise//
        const users = await userService.getAll(req.query as any);
        res.json(users.map(UserDto.toResponse));
    } catch (e) {
        next(e);
    }
};
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getById(Number(req.params.id));
        if (!user) throw new AppError(404, "Користувача не знайдено");
        res.json(UserDto.toResponse(user));
    } catch (e) {
        next(e);
    }
};
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const error = UserDto.validate(req.body);
        if (error) throw new AppError(400, error);
        
        const newUser = await userService.create(req.body);
        res.status(201).json(UserDto.toResponse(newUser));
    } catch (e: any) {
        if (e.message && e.message.includes("UNIQUE constraint failed")) {
            return next(new AppError(409, "Користувач з таким ім'ям вже існує"));
        }
        next(e);
    }
};
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await userService.update(Number(req.params.id), req.body);
        if (!updated) throw new AppError(404, "Користувача не знайдено");
        res.json(UserDto.toResponse(updated));
    } catch (e) {
        next(e);
    }
};
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const success = await userService.remove(Number(req.params.id));
        if (!success) throw new AppError(404, "Користувача не знайдено");
        res.status(204).send();
    } catch (e) {
        next(e);
    }
};