import * as repo from '../repositories (in-memory дані)/status.repository';
import { Status } from '../entities(Структура даних)/status.entity';

export const getAll = (): Status[] => repo.findAll();

export const getById = (id: number): Status | undefined => repo.findById(id);

export const create = (data: Omit<Status, 'id'>): Status => repo.create(data);

export const remove = (id: number): boolean => repo.remove(id);