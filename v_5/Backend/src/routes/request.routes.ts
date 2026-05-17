import { Router } from 'express';
import { getAll, getById, create, update, remove, getStatistics, dangerousSearch } from '../сontrollers/request.controller';

const router = Router();

router.get('/analysis/stats', getStatistics);
router.get('/search/unsafe', dangerousSearch);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;